FROM balenalib/raspberrypi3-64-debian:buster-python:3
# replace "raspberrypi3-64" by "raspberrypi4-64" for rpi4 devices

WORKDIR /app
ADD . /app
# RUN apt-get update -y && apt-get install -y python3-pip python3-dev
# RUN apt-get install -y libnftnl-dev && apt-get install -y libnftnl11
RUN pip install -r requirements.txt

CMD [ "python3", "manage.py", "run" ]
