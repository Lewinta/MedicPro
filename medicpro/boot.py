import frappe

def boot_session(bootinfo):
	bootinfo.conf = frappe.get_single("MedicPro Settings")
	