#!/usr/bin/env sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Welcome to OpenVVRT! Now commencing installation"

#Installing docker
echo "${GREEN}Removing existing Docker installation${NC}"
sudo apt remove -y docker docker-engine docker.io containerd runc
echo "${GREEN}Installing Docker dependencies${NC}"
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
echo "${GREEN}Adding Docker GPT key${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "${GREEN}Adding Docker repository${NC}"
echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
echo "${GREEN}Installing Docker${NC}"
sudo apt install -y docker-ce docker-ce-cli containerd.io
echo "${GREEN}Installing docker-compose and seeting permissions${NC}"
sudo apt install -y python3-pip
sudo pip3 install docker-compose

#Installing nvm and recommended version
echo "${GREEN}Installing and configuring nvm${NC}"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
echo "${GREEN}Installed nvm, sourcing bashrc${NC}"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install stable

echo "${GREEN}Installing pm2${NC}"
npm install pm2 -g
pm2 startup

#Configuring openvvrt api
echo "${GREEN}Installing ov_api dependencies${NC}"
cd ov_api
npm install
pm2 start --name ov-api index.js
cd ..

#Installing tsc
npm i -g typescript

#Configuring RabbitMQ
echo "${GREEN}Installing RabbitMQ${NC}"
sudo apt install -y erlang rabbitmq-server 
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
echo "${GREEN}Activating rabbitmq management plugin${NC}"
sudo rabbitmq-plugins enable rabbitmq_management
echo "${GREEN}Creating RabbitMQ User${NC}"
sudo rabbitmqctl add_user vivi vivitek
sudo rabbitmqctl set_user_tags vivi administrator
sudo rabbitmqctl set_permissions -p / vivi ".*" ".*" ".*"

#Configuring postgres
echo "${GREEN}Installing OpenVVRT's services${NC}"
sudo docker-compose up -d postgres dhcpd graphql

echo "${GREEN}Installing Firewall service dependencies${NC}"
sudo apt install -y build-essential libpq-dev procps nftables
echo "${GREEN}Installing Firewall service${NC}"
cd firewall
pip3 install -r requirements.txt



echo "${GREEN}Installing Graphql service${NC}"




#Network hotspot configuration
echo "${GREEN}Configuring Hotspot network${NC}"
sudo cp configs/10-my-config.yml /etc/netplan
sudo netplan generate
sudo netplan apply
echo "${GREEN}Hotspot configured!${NC}"
