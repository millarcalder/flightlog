FROM python:3.10

ARG wheel_name

COPY $wheel_name /tmp/$wheel_name
RUN pip install /tmp/$wheel_name

ENTRYPOINT [ "flightlog" ]
