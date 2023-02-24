#!/bin/bash
version=$1
rm -r ./build/
cp -R ../build ./build
docker build . --tag ghcr.io/millarcalder/flightlog-frontend:$version
docker push ghcr.io/millarcalder/flightlog-frontend:$version
