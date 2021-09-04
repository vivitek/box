#!/bin/bash

sudo rabbitmq-plugins enable rabbitmq_management;
sudo rabbitmqctl list_users | grep -q 'vivi'
if [[ $? -ne 0 ]]; then
  sudo rabbitmqctl add_user vivi vivitek;
  sudo rabbitmqctl set_user_tags vivi administrator;
  sudo rabbitmqctl set_permissions -p / vivi '.*' '.*' '.*';
fi;
