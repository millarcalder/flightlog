SHELL := /bin/bash

VERSION=0.0.1

developer-setup: developer-setup-backend developer-setup-frontend

developer-setup-backend:
	@cd ./backend; \
	python3 -m venv .virtualenv; \
	source .virtualenv/bin/activate; \
	pip install -r requirements.txt; \
	pip install -r requirements-dev.txt

developer-setup-frontend:
	@cd frontend; \
	npm install

format-frontend-code:
	@cd frontend; \
	npx prettier --write .

build-backend-dist:
	@cd backend; \
	source .virtualenv/bin/activate; \
	python -m build

build-backend-docker-image: build-backend-dist
	@cd ./backend/docker; \
	sh ./build-local.sh ${VERSION}

build-backend-docker-image-rp4: build-backend-dist
	@ansible-playbook ./ansible/build.yml -i ./ansible/inventory/build.ini --ask-vault-password --ask-become-pass --extra-vars "version=${VERSION} backend=yes"

build-frontend-docker-image:
	@cd ./frontend; \
	npm install; \
	npm run build; \
	cd ./docker; \
	sh ./build-local.sh ${VERSION}

build-frontend-docker-image-rp4:
	@cd ./frontend; \
	npm install; \
	npm run build; \
	cd ../;\
	ansible-playbook ./ansible/build.yml -i ./ansible/inventory/build.ini --ask-vault-password --ask-become-pass --extra-vars "version=${VERSION} frontend=yes"

run-webapp-backend:
	@cd backend; \
	source .virtualenv/bin/activate; \
	uvicorn flightlog.webapp.app:app --port 5000 --reload

run-webapp-frontend:
	@cd frontend; \
	npm start

deploy-backend-production:
	ansible-playbook ./ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=${VERSION} backend=yes"

deploy-backend-production-rp4:
	ansible-playbook ./ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=pi-${VERSION} backend=yes"

deploy-frontend-production:
	ansible-playbook ./ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=${VERSION} frontend=yes"

deploy-frontend-production-rp4:
	ansible-playbook ./ansible/deploy.yml --ask-vault-password --extra-vars "env_name=production version=pi-${VERSION} frontend=yes"
