SHELL := /bin/bash

VERSION=0.0.1

developer-setup: developer-setup-backend developer-setup-frontend

developer-setup-backend:
	@cd ./backend; \
	python3 -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.txt

developer-setup-frontend:
	@cd frontend; \
	npm install

build-backend-dist:
	@cd backend; \
	python -m build

build-backend-docker-image: build-backend-dist
	@cd ./backend/docker; \
	sh ./build-local.sh ${VERSION} \
	docker push ghcr.io/millarcalder/flightlog:${VERSION}

build-backend-docker-image-rp4: build-backend-dist
	@cd ./backend; \
	ansible-playbook ./ansible/build.yml -i ./ansible/inventory/build.ini --ask-vault-password --ask-become-pass --extra-vars "version=${VERSION}"

run-webapp-backend:
	@cd backend; \
	uvicorn flightlog.webapp.app:app --port 5000 --reload

run-webapp-frontend:
	@cd frontend; \
	npm start

deploy-backend-production:
	ansible-playbook ./backend/ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=${VERSION}"

deploy-backend-production-rp4:
	ansible-playbook ./backend/ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=pi-${VERSION}"
