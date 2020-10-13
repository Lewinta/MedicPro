import frappe

def validate(doc, event):
	if doc.date_of_birth:
		calculate_age(doc)

def calculate_age(doc):
	pass