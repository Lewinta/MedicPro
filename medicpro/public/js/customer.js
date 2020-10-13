frappe.ui.form.on("Customer", {
	setup: frm => {
		frm.set_query("ars", event => {
			return {
				"filters": {
					"customer_group": "ARS"
				}
			}
		})
	},
	refresh: frm => {
		frm.set_df_property("naming_series", "hidden", 1);
	},
	customer_name: frm => {
		if(!frm.doc.customer_name)
			return
		let new_name = frm.doc.customer_name.toUpperCase().trim()
		frm.set_value("customer_name", new_name);
	},
	ars: frm => {
		frm.toggle_reqd("ars_name", !!frm.doc.ars);
	}, 
	customer_group: frm => {
		
		frm.toggle_reqd("date_of_birth", frm.doc.customer_group == "Clientes");

		if(frm.doc.customer_group == "ARS"){
			frm.set_value("customer_type", "Company");
			frm.set_value("naming_series", "ARS-.########");
		}
		
		if(frm.doc.customer_group == "Clientes"){
			frm.set_value("customer_type", "Individual");
			frm.set_value("naming_series", "CUST-.########");
		}
	}
});