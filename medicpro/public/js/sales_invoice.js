frappe.provide("medicpro.sales_invoice");

frappe.ui.form.on("Sales Invoice", {
	setup: frm => {
		if(frm.is_new() && !frm.doc.is_return){
			frm.clear_table("items");
			frm.refresh_field("items");
			frm.trigger("show_prompt");
		}
	},
	set_queries: frm => {
		frm.set_query("customer", event => {
			let customer_group = frm.doc.invoice_type == "ARS" ? "ARS" : "Patients";
			return {
				"filters": {
					"customer_group": customer_group,
					"disabled": 0,
				}
			}
		});
	
		frm.set_query("patient", event => {
			if(frm.doc.invoice_type == "Insurance Patient")
				return {
					"filters": {
						"ars": ["!=", ""],
						"status": "Active",
					}
				}
			else
				return {
					"filters": {
						"status": "Active",
					}
				}

		});
		frm.set_query("item_code", "items", () => {
			if (["Insurance Patient", "Private Patient"].includes(frm.doc.invoice_type)) {
				return {
					"query": "medicpro.queries.item_by_ars",
					"filters": {
						"ars": frm.doc.ars,
						"ars_name": frm.doc.ars_name
					}
				};
			} else {
				let item_group = frm.doc.tipo_de_factura == "Proveedores" ? "Consultas" :
					frm.doc.tipo_de_factura == "Alquiler" ? "ALQUILER" :
						["not in", "Consultas, ALQUILER"];

				return {
					"filters": {
						"item_name": item_group
					}
				};
			}
		});
	},
	show_prompt: frm => {
		frm.$wrapper.hide();

		let fields = [{
			"label": __("Invoice Type"), 
			"fieldname": "invoice_type", 
			"fieldtype": "Select", 
			"options": "Private Patient\nInsurance Patient\nARS",
			"reqd": "1"
		}];

		let p = frappe.prompt(fields, (values) => {
			frm.set_value("invoice_type", values.invoice_type);
			frm.$wrapper.show();
		}, "Seleccione el tipo de Factura", "Siguiente");

		p.onhide = () => frm.$wrapper.show();
	},
	invoice_type: frm => {
		if( ["Private Patient", "Insurance Patient"].includes(frm.doc.invoice_type)){
			frm.set_value("is_pos", 1);
			frm.set_value("naming_series", "B02.########");
		}
		
		if(frm.doc.invoice_type == "ARS"){
			frm.set_value("is_pos", 0);
			frm.set_value("naming_series", "B01.########");
		}

		$.map(["set_queries", "set_insurance_coverage"], event => {
			frm.trigger(event);
		});
	},
	customer: frm => {
		frm.trigger("set_insurance_coverage");
		frm.trigger("invoice_type");
		setTimeout(function () {
			frm.set_value("items", []);
			frm.set_df_property("insurance_coverage", "read_only", frm.doc.invoice_type == "Insurance Patient" ? 0 : 1, frm.docname, "items");
			frm.set_df_property("rate", "read_only", 1, frm.docname, "items");
			refresh_field("items");
		}, 500);
	},
	ars: frm =>{
    	let price_list = frm.doc.ars ? frm.doc.ars : "Venta estándar";

    	frm.set_value("selling_price_list", price_list);
    },	
	patient: frm => {
		frm.trigger("set_insurance_coverage");
		frm.trigger("invoice_type");
		if (frm.is_new() && !!frm.doc.customer && frm.doc.items.length == 0)
			frm.add_child("items", {});
	},	
	set_insurance_coverage: frm => {
		let coverage = frappe.boot.conf.default_insurance_coverage;
		if (frm.doc.invoice_type == "Insurance Patient")
			frm.set_value("insurance_coverage", coverage);
		else
			frm.set_value("insurance_coverage", 0.00);

	},
	item_table_update: (frm, cdt, cdn) => {
		let row = locals[cdt][cdn];
		frappe.run_serially([
			() => frappe.timeout(0.5),
			() => { if (row && !row.item_code) return },
			() => row.difference_amount = isNaN(row.difference_amount) ? 0.00 : row.difference_amount,
			() => row.rate = isNaN(row.rate) ? 0.00 : row.rate,
			() => row.authorized_amount = aplicar_porciento(row) ? row.rate * flt(row.insurance_coverage) / 100.00 : 0,
			() => row.claimed_amount = aplicar_porciento(row) ? row.rate : 0,
			() => row.difference_amount = row.rate - row.authorized_amount,
			// () => row.difference_amount += row.adjustment - row.copago,
			// () => row.rate += row.adjustment,
			() => refresh_field("items"),
			() => frm.trigger("refresh_outside_amounts"),
		])
	},
	refresh_outside_amounts: frm => {
		let total_authorized_amount = 0.000;
		let total_claimed_amount = 0.000;
		let total_difference_amount = 0.000;

		$.map(frm.doc.items, (row) => {
			total_authorized_amount += row.authorized_amount;
			total_claimed_amount += row.claimed_amount;
			total_difference_amount += row.difference_amount;
		});

		frappe.run_serially([
			frm.set_value("claimed_amount", total_claimed_amount),
			frm.set_value("authorized_amount", total_authorized_amount),
			frm.set_value("difference_amount", total_difference_amount),
			
			medicpro.sales_invoice.update_payment_table(frm, {
				"total_authorized_amount": total_authorized_amount,
				"total_difference_amount": total_difference_amount
			})
		])

		refresh_field("items");
	}
});

frappe.ui.form.on("Sales Invoice Item", {
	item_code: (frm, cdt, cdn) => {
		let condition = frm.doc.invoice_type != "Alquiler" && frm.doc.invoice_type != "Proveedores" ? true : false

		frappe.run_serially([
			() => frappe.timeout(0.3),
			() => condition && frm.events.item_table_update(frm, cdt, cdn),
			() => frappe.timeout(1.3),
			() => frm.cscript.calculate_paid_amount(),
			() => frm.refresh_fields()
		]);
	},
	items_remove: (frm, cdt, cdn) => {
		frm.trigger("refresh_outside_amounts");
	},
	insurance_coverage: (frm, cdt, cdn) => {
		frappe.run_serially([
			() => frappe.timeout(0.3),
			() => frm.events.item_table_update(frm, cdt, cdn),
		]);
	},
	items_add: (frm, cdt, cdn) => {
		let row = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "insurance_coverage", frm.doc.insurance_coverage);
		frappe.model.set_value(cdt, cdn, "rate", row.insurance_coverage * row.rate);
	},
});

$.extend(medicpro.sales_invoice, {
	add_row_and_update_sales_invoices: (frm, selections, args) => {
		let opts = {
			"method": "medicpro.api.update_sales_invoice"
		};

		opts.args = {
			"doc": frm.doc,
			"selections": selections.join(","),
			"args": args
		};

		frappe.call(opts).done((response) => {
			let doc = response.message;

			if (doc) {
				frappe.model.sync(doc) && frm.refresh();
			}
		}).fail(() => frappe.msgprint("¡Ha ocurrido un error!"));
	},
	update_payment_table: (frm, opts) => {

		$.grep(frm.doc.payments, (payment) => {
			return payment.mode_of_payment == "Efectivo";
		}).map((payment) => {
			payment.amount = opts.total_difference_amount;
		});

		$.grep(frm.doc.payments, (payment) => {
			return payment.mode_of_payment == "Seguro";
		}).map((payment) => {
			payment.amount = opts.total_authorized_amount;
		});

		refresh_field("payments");
	}
});

function aplicar_porciento(row) {

	if (row && row.item_name)
		return row.item_name.substring(0, 10) != "Diferencia";
}