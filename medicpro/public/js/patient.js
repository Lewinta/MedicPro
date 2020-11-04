frappe.ui.form.on("Patient", {
	setup: frm => {
		frm.set_query("ars", ars => {
			return {
				"filters": {
					"customer_group": "ARS",
					"disabled": 0,
				}
			}
		})
	},
	tax_id: frm => {
		if (!frm.doc.tax_id)
			return
		frm.set_value("tax_id", mask_ced_pas_rnc(frm.doc.tax_id))
	},
	patient_name: frm => {
		frm.set_value("patient_name", frm.doc.patient_name.toUpperCase().trim());
	},
	ars: frm => {
		frm.set_df_property("nss", "reqd", !!frm.doc.ars);
	}
});

frappe.ui.form.on("Patient Document", {
	filename: (frm, cdt, cdn) => {
		let row = locals[cdt][cdn];
		if (!row.filename)
			return
		let filename = row.filename.toUpperCase().trim();
		frappe.model.set_value(cdt, cdn, "filename", filename);
		refresh_field("documents");
	}
})