SHELL := /bin/bash

developer-setup: developer-setup-backend developer-setup-frontend

developer-setup-backend:
	@cd ./backend; \
	python3 -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.txt; \
	pip install -r requirements-dev.txt; \
	pip install -e .

developer-setup-frontend:
	@cd frontend; \
	npm install

format-frontend-code:
	@cd frontend; \
	npx prettier --write .

format-backend-code:
	@cd backend; \
	python3 -m venv .virtualenv; \
	black flightlog
