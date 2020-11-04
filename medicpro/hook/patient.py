import frappe
from frappe import _

def after_insert(doc, event):
	create_customer(doc)

def on_update(doc, event):
	sync_customer(doc)

def create_customer(doc):
	customer_group = frappe.get_value("Selling Settings", None, "customer_group")
	territory = frappe.get_value("Selling Settings", None, "territory")
	if not (customer_group and territory):
		customer_group = "Commercial"
		territory = "Rest Of The World"
		frappe.msgprint(_("Please set default customer group and territory in Selling Settings"), alert=True)
	customer = frappe.get_doc({"doctype": "Customer",
	"customer_name": doc.patient_name,
	"customer_group": customer_group,
	"territory" : territory,
	"tax_id" : doc.tax_id,
	"ars" : doc.ars,
	"ars_name" : doc.ars_name,
	"nss" : doc.nss,
	"customer_type": "Individual"
	}).insert(ignore_permissions=True)
	frappe.db.set_value("Patient", doc.name, "customer", customer.name)
	frappe.msgprint(_("Customer {0} is created.").format(customer.name), alert=True)

def sync_customer(doc):
	if not frappe.db.exists("Customer", doc.customer):
		return
	customer = frappe.get_doc("Customer", doc.customer)
	customer.update({
		"customer_name": doc.patient_name,
		"tax_id" : doc.tax_id,
		"ars" : doc.ars,
		"gender" : doc.sex,
		"salutation" : "Sra." if doc.sex == "Femenino" else "Sr.",
		"ars_name" : doc.ars_name,
		"nss" : doc.nss,
	})
	customer.save(ignore_permissions=True)
