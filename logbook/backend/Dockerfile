FROM python:3.12

# Build and install the python package
COPY ./dist/ /code/dist/
COPY ./VERSION /code/VERSION
RUN pip install /code/dist/logbook-$(cat /code/VERSION)-py3-none-any.whl
RUN rm -r /code

ENTRYPOINT [ "logbook", "production", "run-webapp" ]
EXPOSE 5000
