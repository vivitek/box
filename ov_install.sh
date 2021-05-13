#!/usr/bin/env sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "Welcome to OpenViVi! Now commencing installation"

echo -e "${GREEN}Configuring Hotspot network${NC}"
sudo cp configs/10-my-config.yml /etc/netplan
sudo netplan generate
sudo netplan apply
echo -e "${GREEN}Hotspot configured!${NC}"

