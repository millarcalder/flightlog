FROM python:3.11

ARG wheel_name

COPY $wheel_name /tmp/$wheel_name
RUN pip install /tmp/$wheel_name

ENTRYPOINT [ "logbook", "production", "run-webapp", "--env-file", "/opt/logbook/.env" ]
EXPOSE 5000
