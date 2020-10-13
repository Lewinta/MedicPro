import frappe
from frappe.utils import nowdate

def validate(doc, event):
	if doc.date_of_birth:
		calculate_age(doc)

def calculate_age(doc):
	age_m = calculate_age_m(doc.date_of_birth)
	
	if age_m > 12:
		doc.age = "{} Año(s)".format(
			calculate_age_y(doc.date_of_birth)
		)
	else:
		doc.age = "{} Mes(es)".format(age_m)

def calculate_age_y(c_date, a_date=None):
	age = 0	
	today = a_date if a_date else nowdate();
	now_year = int(today.split("-")[0]);
	now_month = int(today.split("-")[1]);

	dt_year = int(c_date.split("-")[0]);
	dt_month = int(c_date.split("-")[1]);

	adj = 0 if now_month >= dt_month else -1
	
	age = (now_year - dt_year)  + adj

	return age 

def calculate_age_m(c_date, a_date=None):
	age = 0
	today = a_date if a_date else nowdate();
	now_year = int(today.split("-")[0]);
	now_month = int(today.split("-")[1]);
	now_day = int(today.split("-")[2]);

	dt_year = int(c_date.split("-")[0]);
	dt_month = int(c_date.split("-")[1]);
	dt_day = int(c_date.split("-")[2]);

	adj = 0 if now_day >= dt_day else -1
	
	age = (now_year - dt_year) * 12 + now_month - dt_month + adj

	return age 