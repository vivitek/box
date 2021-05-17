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
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
echo -e "${GREEN}Installing Docker${NC}"
sudo apt install -y docker-ce docker-ce-cli containerd.io
echo -e "${GREEN}Installing docker-compose and seeting permissions${NC}"
<<<<<<< HEAD
sudo apt install -y python3-pip
=======
sudo apt-get install python3-pip
>>>>>>> [fix] alternative docker-compose install method
sudo pip3 install docker-compose

#Installing nvm and recommended version
echo -e "${GREEN}Installing and configuring nvm${NC}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
echo -e "${GREEN}Installed nvm, sourcing bashrc${NC}"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install stable

echo -e "${GREEN}Installing pm2${NC}"
npm install pm2 -g
pm2 startup

#Configuring openvvrt api
echo -e "${GREEN}Installing ov_api dependencies${NC}"
cd ov_api
npm install
pm2 start --name ov-api index.js
cd ..

#Configuring RabbitMQ
echo -e "${GREEN}Installing RabbitMQ${NC}"
sudo apt install -y erlang rabbitmq-server 
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
echo -e "${GREEN}Activating rabbitmq management plugin${NC}"
sudo rabbitmq-plugins enable rabbitmq_management

#Network hotspot configuration
echo -e "${GREEN}Configuring Hotspot network${NC}"
sudo cp configs/10-my-config.yml /etc/netplan
sudo netplan generate
sudo netplan apply
echo -e "${GREEN}Hotspot configured!${NC}"
