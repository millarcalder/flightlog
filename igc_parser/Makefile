SHELL := /bin/bash

developer-setup:
	python -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.dev.txt

build:
	source .virtualenv/bin/activate; \
	python -m build;

test:
	source .virtualenv/bin/activate; \
	python -m pytest igc_parser/tests

linting:
	source .virtualenv/bin/activate; \
	python -m black igc_parser --check; \
	python -m isort igc_parser --check-only; \
	python -m flake8 igc_parser

release-test: build
	source .virtualenv/bin/activate; \
	python -m twine upload --repository testpypi dist/*

release: build
	source .virtualenv/bin/activate; \
	python -m twine upload dist/*
