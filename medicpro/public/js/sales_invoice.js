frappe.ui.form.on("Sales Invoice", {
	setup: frm => {
		frm.is_new() && !frm.doc.is_return && frm.trigger("show_prompt");
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
	},
	show_prompt: frm => {
		frm.$wrapper.hide();

		let fields = [{
			"label": __("Invoice type"), 
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
	},
	ars: frm =>{
    	let price_list = frm.doc.ars ? frm.doc.ars : "Venta estándar";

    	frm.set_value("selling_price_list", price_list);
    },	
	patient: frm => {
		frm.trigger("set_insurance_coverage");
		frm.trigger("invoice_type");
	},	
	set_insurance_coverage: frm => {
		let coverage = frappe.boot.conf.default_insurance_coverage;
		if (frm.doc.invoice_type == "Insurance Patient")
			frm.set_value("insurance_coverage", coverage);
		else
			frm.set_value("insurance_coverage", 0.00);

	}
});