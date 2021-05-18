#!/usr/bin/env sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Welcome to OpenVVRT! Now commencing installation"

# # Installing docker
# echo "${GREEN}Removing existing Docker installation${NC}"
# sudo apt remove -y docker docker-engine docker.io containerd runc
# echo "${GREEN}Installing Docker dependencies${NC}"
# sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
# echo "${GREEN}Adding Docker GPT key${NC}"
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# echo "${GREEN}Adding Docker repository${NC}"
# echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# sudo apt update
# echo "${GREEN}Installing Docker${NC}"
# sudo apt install -y docker-ce docker-ce-cli containerd.io
# echo "${GREEN}Installing docker-compose and seeting permissions${NC}"
# sudo apt install -y python3-pip
# sudo pip3 install docker-compose

# Installing nvm and recommended version
echo "${GREEN}Installing and configuring nodejs${NC}"
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

echo "${GREEN}Installing pm2${NC}"
sudo npm i -g pm2@latest
pm2 kill
pm2 startup

# Configuring openvvrt api
echo "${GREEN}Installing and activating API${NC}"
cd ov_api
npm install
sudo pm2 start --name ov-api index.js
cd ..

echo "${GREEN}Building baremetal services${NC}"


# Configuring RabbitMQ
echo "${GREEN}Building RabbitMQ ${NC}"
sudo apt install -y rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
echo "${GREEN}Activating rabbitmq management plugin${NC}"
sudo rabbitmq-plugins enable rabbitmq_management
echo "${GREEN}Creating RabbitMQ User${NC}"
sudo rabbitmqctl add_user vivi vivitek
sudo rabbitmqctl set_user_tags vivi administrator
sudo rabbitmqctl set_permissions -p / vivi ".*" ".*" ".*"


echo "${GREEN}Installing Postgresql services${NC}"
sudo apt install -y postgresql postgresql-contrib
SQL_DUMP=$(cat ./postgres/init.sql)
sudo chmod +r ./postgres/init.sql
sudo -u postgres psql postgres < ./postgres/init.sql

# Configuring postgres
echo "${GREEN}Installing OpenVVRT's services${NC}"


# Configuring firewall
echo "${GREEN}Installing Firewall service dependencies${NC}"
sudo apt install -y build-essential libpq-dev procps nftables
echo "${GREEN}Creating firewall systemd${NC}"
cat ./configs/firewall.service.template | sed 's@$PWD@'"$PWD"'@' | sudo tee /etc/systemd/system/firewall.service
echo "${GREEN}Installing Firewall service${NC}"
cd firewall
sudo pip3 install -r requirements.txt
echo "${GREEN}Starting firewall service${NC}"
python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade
echo "${GREEN}Starting firewall systemd${NC}"
sudo systemctl daemon-reload
sudo systemctl enable firewall
sudo systemctl start firewall
cd ..


# Configuring DHCP
echo "${GREEN}Installing DHCP dependencies${NC}"
cd dhcpd
npm install
./node_modules/typescript/bin/tsc 
echo "${GREEN}Starting DHCP service${NC}"
sudo pm2 start --name dhcp dist/main.js
cd ..


# Configuring GraphQL relay
echo "${GREEN}Installing GraphQl dependencies${NC}"
cd graphql
npm install
./node_modules/typescript/bin/tsc 
echo "${GREEN}Starting GraphQl service${NC}"
sudo pm2 start --name graphql dist/index.js
cd ..


# Network hotspot configuration
echo "${GREEN}Configuring Hotspot network${NC}"
sudo cp configs/10-my-config.yml /etc/netplan
sudo netplan generate
sudo netplan apply
echo "${GREEN}Hotspot configured!${NC}"


sudo apt autoremove -y