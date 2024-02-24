SHELL := /bin/bash

developer-setup:
	python -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.txt; \
	pip install -r requirements.dev.txt; \
	pip install -e .

build:
	source .virtualenv/bin/activate; \
	python -m build

test:
	source .virtualenv/bin/activate; \
	python -m pytest viewer/tests
