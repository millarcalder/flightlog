#!/bin/bash

version=$1
wheel_name="flightlog-$version-py3-none-any.whl"

cp ../dist/$wheel_name $wheel_name
docker build . --tag ghcr.io/millarcalder/flightlog:$version --build-arg wheel_name=$wheel_name
