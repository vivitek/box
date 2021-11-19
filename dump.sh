#!/bin/bash

rabbitmqadmin delete queue name=dhcp
sudo rm /root/.pm2/logs/graphql-*.log
sudo pm2 flush > /dev/null
sudo pm2 delete all > /dev/null
rm -f ~/.ssh.id_tunnel*
nmcli con delete VIVI > /dev/null
redis-cli FLUSHALL
rm -f *.log
node create-openvvrt.js --skip-install
sudo systemctl restart openvivi
