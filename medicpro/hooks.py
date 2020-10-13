# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "medicpro"
app_title = "MedicPro"
app_publisher = "Lewin Villar"
app_description = "Aplicacion para la gestion medica"
app_icon = "fa fa-medkit"
app_color = "#2155a2"
app_email = "lewinvillar@tzcode.tech"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/medicpro/css/medicpro.css"
# app_include_js = "/assets/medicpro/js/medicpro.js"

# include js, css files in header of web template
# web_include_css = "/assets/medicpro/css/medicpro.css"
# web_include_js = "/assets/medicpro/js/medicpro.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
	"Item" : "public/js/item.js"
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "medicpro.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "medicpro.install.before_install"
# after_install = "medicpro.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "medicpro.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"medicpro.tasks.all"
# 	],
# 	"daily": [
# 		"medicpro.tasks.daily"
# 	],
# 	"hourly": [
# 		"medicpro.tasks.hourly"
# 	],
# 	"weekly": [
# 		"medicpro.tasks.weekly"
# 	]
# 	"monthly": [
# 		"medicpro.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "medicpro.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "medicpro.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "medicpro.task.get_dashboard_data"
# }

