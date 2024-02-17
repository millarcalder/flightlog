SHELL := /bin/bash

developer-setup:
	@python -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.dev.txt;

build:
	@source .virtualenv/bin/activate; \
	python -m build;

release-test: build
	@source .virtualenv/bin/activate; \
	python -m twine upload --repository testpypi dist/*

release: build
	@source .virtualenv/bin/activate; \
	python -m twine upload dist/*
