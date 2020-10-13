frappe.ui.form.on("Item", {
	setup: frm => {

	},
	item_name: frm => {
		if(!frm.doc.item_name)
			return
		let new_name = frm.doc.item_name.toUpperCase().trim();
		frm.set_value("item_name", new_name);
		frm.set_value("item_code", new_name);
	}
});