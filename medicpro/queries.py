import frappe
from frappe.utils import flt

@frappe.whitelist()
def item_by_ars(doctype, txt, searchfield, start, page_len, filters):
	if not filters.get("ars"): 
		return frappe.get_list("Item", filters={
			"item_code": ["not in", "Consultas, ALQUILER"]
		}, fields=["item_code"], as_list=True)

	result = frappe.db.sql("""
		SELECT
			item_code AS item,
			price_list AS ars,
			currency,
			price_list_rate AS price
		FROM
			`tabItem Price` AS price 
		WHERE
			price_list = '{1}'
		AND
			item_code LIKE '%{0}%'
		ORDER BY item_code LIMIT 20
	""".format("%".join(txt.split()), filters.get("ars")), as_dict=True)

	return [[row.item, "{1} $ {0}".format(flt(row.price, 2), row.currency), row.ars] for row in result]