FROM python:3.12

# Build and install the python package
COPY . /code
RUN cd /code && make build
RUN pip install /code/dist/viewer-$(cat /code/VERSION)-py3-none-any.whl
RUN rm -r /code

ENTRYPOINT [ "viewer", "production", "run-webapp", "--env-file", "/opt/flightlog/viewer/.env" ]
EXPOSE 5000
