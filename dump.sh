#!/bin/bash

rabbitmqadmin delete queue name=dhcp
rabbitmqadmin delete queue name=pcap
sudo rm /root/.pm2/logs/graphql-*.log
sudo pm2 flush > /dev/null
sudo pm2 delete all > /dev/null
rm -f ~/.ssh.id_tunnel*
nmcli con delete VIVI > /dev/null
redis-cli FLUSHALL
rm -f *.log
sudo node create-openvvrt.js
sudo systemctl restart openvivi
