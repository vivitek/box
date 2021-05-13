#!/usr/bin/env sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "Welcome to OpenVVRT! Now commencing installation"

#Installing docker
echo -e "${GREEN}Removing existing Docker installation${NC}"
sudo apt remove -y docker docker-engine docker.io containerd runc
echo -e "${GREEN}Installing Docker dependencies${NC}"
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
echo -e "${GREEN}Adding Docker GPT key${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo -e "${GREEN}Adding Docker repository${NC}"
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
echo -e "${GREEN}Adding Docker repository${NC}"
sudo apt update
echo -e "${GREEN}Installing Docker${NC}"
sudo apt install docker-ce docker-ce-cli containerd.io
echo -e "${GREEN}Installing docker-compose and seeting permissions${NC}"
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

#Network hotspot configuration
echo -e "${GREEN}Configuring Hotspot network${NC}"
sudo cp configs/10-my-config.yml /etc/netplan
sudo netplan generate
sudo netplan apply
echo -e "${GREEN}Hotspot configured!${NC}"
