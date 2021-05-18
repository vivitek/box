FROM python:3.7

WORKDIR /app
COPY . .

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y build-essential
RUN apt-get install -y libpq-dev
RUN apt-get install -y procps
RUN apt-get install -y systemd
RUN apt-get install -y nftables


RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install get_nic

CMD [ "sh", "start.sh" ]