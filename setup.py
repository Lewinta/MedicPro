# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in medicpro/__init__.py
from medicpro import __version__ as version

setup(
	name='medicpro',
	version=version,
	description='Aplicacion para la gestion medica',
	author='Lewin Villar',
	author_email='lewinvillar@tzcode.tech',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
