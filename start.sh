#/bin/bash

# Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Firewall
sudo systemctl enable nftables
sudo systemctl start nftables
sudo systemctl enable firewall
sudo systemctl start firewall

# DHCP
sudo pm2 restart DHCP

# Graphql
sudo pm2 restart graphql

# OpenVVRT
sudo pm2 restart OpenVVRT

# OpenVIVI
sudo systemctl enable openvivi
sudo systemctl start openvivi