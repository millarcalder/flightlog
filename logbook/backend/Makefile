SHELL := /bin/bash

developer-setup:
	python -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	python -m pip install -r requirements.txt; \
	python -m pip install -r requirements.dev.txt; \
	python -m pip install -e .

build: developer-setup
	source .virtualenv/bin/activate; \
	python -m build

test:
	source .virtualenv/bin/activate; \
	python -m pytest logbook/tests

linting:
	source .virtualenv/bin/activate; \
	python -m black logbook --check; \
	python -m isort logbook --check-only; \
	python -m flake8 logbook
