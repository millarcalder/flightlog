# Flightlog

This is a small personal project I have started to practice frontend development, and as a test case for deploying a website to my [Raspberry Pi Kubernetes cluster](https://github.com/millarcalder/k3s_rp4_cluster).

You can upload a `.igc` flight log file, commonly used in gliders and paragliders, and view a 3D map of your flight.

![Screenshot](screenshot.png)

## Developer Guide

*Note: the ansible playbooks in this repo are setup for my environment, so they use my domain names, docker registry, encrypted secrets, etc...*

I've been developing this project on both Debian based Linus and MacOS, potentially you might have some issues on Windows with some of the automated scripts.

Requirements:
  - [Ansible](https://www.ansible.com/)
  - [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) (connected to your Kubernetes cluster)
  - [npm](https://www.npmjs.com/)
  - [Python](https://www.python.org/) `>=3.10`

Example Ansible inventory file

```
[build_server]
ansible_connection=ssh ansible_host=1.2.3.4 ansible_user=ubuntu

[webservers]
ansible_connection=ssh ansible_host=1.2.3.4 ansible_user=ubuntu
```

### Running locally

```bash
make developer-setup

# Backend
source ./backend/.virtualenv/bin/activate
flightlog local run-webapp --reload

# Frontend
cd frontend
npm start  # remember to create a .env file! See .env.example for a template
```

### Build Docker Images

You need to build the Docker Images on the target architecture which you are deploying to. For example Raspberry Pi's use an arm64 architecture, if you develop on an x86 Intel computer then you will need to run the build script remotely on the target architecture.

You configure which machine that the ansible `build_containers.yml` script is run on via the `build_server` group in the inventory file.

```bash
(cd ./backend; .virtualenv/bin/python -m build)  # Build the python wheel
(cd ./frontend; npm run build)  # Build the frontend bundle

ansible-playbook ./ansible/build_containers.yml \
  -i ./ansible/inventory/foo.ini \
  --ask-vault-password \
  --ask-become-pass \
  --extra-vars "target_architecture=arm64 backend=yes frontend=yes"
```

### Deployment

There are two deployment options:
  - VM - Standard Linux server (E.g. AWS EC2 Instances)
  - K8S - Kubernetes Cluster

#### Web Server

First you must run the provision script which installs required dependencies.

```bash
ansible-playbook ./ansible/vm_provision.yml \
  -i ./ansible/inventory/foo.ini \
  --ask-vault-password \
  --ask-become-pass \
  --extra-vars "target_architecture=arm64"

ansible-playbook ./ansible/vm_deploy.yml \
  -i ./ansible/inventory/foo.ini \
  --ask-vault-password \
  --ask-become-pass \
  --extra-vars "target_architecture=arm64"
```

#### Kubernetes

```bash
ansible-playbook ./ansible/k8s_deploy.yml \
  -i ./ansible/inventory/foo.ini \
  --ask-vault-password \
  --ask-become-pass \
  --extra-vars "target_architecture=arm64 backend=yes frontend=yes"
```

### Versioning

This repository contains two closely related projects, the Python web API and the ReactJS application. They could be versioned seperately, but I have opted for versioning them together because I don't see a use case for deploying them seperately. Versions are managed using Git tags.

The Ansible scripts automatically detect the version using `setuptools_git_versioning`, this way even the Ansible is tied to the version. To be honest I'm not sure whether this is a great idea yet, but the idea is that sometimes new vesions require a different deployment process. Over time the Ansible might drift enough that it can no longer deploy old versions of the application, so you would need to checkout an old git commit anyway.

## Helpful links

https://xp-soaring.github.io/igc_file_format/index.html
