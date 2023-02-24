# Flightlog

This is a small personal project I have started to practice frontend development, and as a test case for deploying a website to my [Raspberry Pi Kubernetes cluster](https://github.com/millarcalder/k3s_rp4_cluster).

You can upload a `.igc` flight log file, commonly used in gliders and paragliders, and view a 3D map of your flight.

![Screenshot](screenshot.png)

## Developer Guide

This project is setup for debian based operating systems, trying to run this on anything else will cause some issues with automated scripts that install dependencies and deploy the apps.

### Running locally

```bash
make developer-setup
make run-webapp-backend
make run-webapp-frontend  # remember to create a .env file! See .env.example for a template
```

### Deployment

*Note: the ansible playbooks in this repo are setup for my environment, so they use my domain names, docker registry, encrypted secrets, etc...*

Requirements:
  - install [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) and connect to your Kubernetes cluster
  - install [npm](https://www.npmjs.com/)

#### Raspberry Pi k8s cluster

##### Backend

The Raspberry Pi 4 has arm64 cpu architecture, so you'll most likely need to build the docker image on a remote Pi since your PC will have a different cpu architecture.

You'll need to create the ansible inventory files `build.ini` and `deploy.ini` in `ansible/inventory/` to run the ansible playbooks on a remote Pi, e.g.

```
[webservers]
ansible_connection=ssh ansible_host=192.168.1.190 ansible_user=ubuntu
```

Build the Raspberry Pi image (this simply just runs it on the remote Pi and tags it differently) `make build-backend-docker-image-rp4`.

Deploy to kubernetes using the Raspberry Pi image `make deploy-backend-production-rp4`.

##### Frontend

```bash
deploy-frontend-production
```

#### Other clusters

If you want to deploy to a local minikube cluster for example.

```bash
make build-backend-docker-image
make deploy-backend-production
make deploy-frontend-production
```

### Helpful links

https://xp-soaring.github.io/igc_file_format/index.html
