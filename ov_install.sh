#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

if ! sudo -E dpkg --configure -a; then
    echo -e "${RED}dpkg is not available, please wait a few minutes${NC}"
    exit 1
fi


echo -e "${GREEN}Welcome to OpenVVRT! Now commencing installation${NC}"

export NODE_ENV="production"
echo '
export AMQP_HOSTNAME=0.0.0.0
export AMQP_USERNAME=vivi
export AMQP_PASSWORD=vivitek
' >> ~/.bashrc
source ~/.bashrc


# Installing basic stuff
sudo apt install -y network-manager
sudo apt install -y net-tools
sudo apt install -y python3-pip

# Installing nvm and recommended version
echo -e "${GREEN}Installing and configuring nodejs${NC}"
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt install -y nodejs

echo -e "${GREEN}Installing pm2${NC}"
sudo npm i -g pm2@latest
sudo pm2 kill
sudo pm2 startup
sudo pm2 flush

# Configuring openvvrt api
echo -e "${GREEN}Installing and activating API${NC}"
cd ov_api
npm install
sudo PORT=9090 pm2 start -f --name ov-api index.js
cd ..

echo -e "${GREEN}Building baremetal services${NC}"


# Configuring RabbitMQ
echo -e "${GREEN}Building RabbitMQ ${NC}"
sudo apt install -y rabbitmq-server
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server
echo -e "${GREEN}Activating rabbitmq management plugin${NC}"
sudo rabbitmq-plugins enable rabbitmq_management
echo -e "${GREEN}Creating RabbitMQ User${NC}"
sudo rabbitmqctl add_user vivi vivitek
sudo rabbitmqctl set_user_tags vivi administrator
sudo rabbitmqctl set_permissions -p / vivi ".*" ".*" ".*"


# Configuring postgres
echo -e "${GREEN}Installing Postgresql services${NC}"
sudo apt install -y postgresql postgresql-contrib
SQL_DUMP=$(cat ./postgres/init.sql)
sudo chmod +r ./postgres/init.sql
sudo -u postgres psql postgres < ./postgres/init.sql


echo -e "${GREEN}Installing OpenVVRT's services${NC}"
# Configuring firewall
echo -e "${GREEN}Installing Firewall service dependencies${NC}"
sudo apt install -y build-essential libpq-dev procps nftables
echo -e "${GREEN}Creating firewall systemd${NC}"
cat ./configs/firewall.service.template | sed 's@$PWD@'"$PWD"'@' | sudo -E tee /etc/systemd/system/firewall.service
echo -e "${GREEN}Installing Firewall service${NC}"
cd firewall
sudo pip3 install -r requirements.txt
echo -e "${GREEN}Starting firewall service${NC}"
python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade
echo -e "${GREEN}Starting firewall systemd${NC}"
sudo systemctl daemon-reload
sudo systemctl enable firewall
sudo systemctl enable nftables
sudo systemctl start nftables
sudo systemctl start firewall
cd ..


# Configuring DHCP
echo -e "${GREEN}Installing DHCP dependencies${NC}"
cd dhcpd
npm install
./node_modules/typescript/bin/tsc
echo -e "${GREEN}Starting DHCP service${NC}"
sudo pm2 start -f --name dhcp dist/main.js
cd ..


# Configuring GraphQL relay
echo -e "${GREEN}Installing GraphQl dependencies${NC}"
cd graphql
npm install
./node_modules/typescript/bin/tsc
echo -e "${GREEN}Starting GraphQl service${NC}"
sudo pm2 start -f --name graphql dist/index.js
cd ..


# Network hotspot configuration
echo -e "${GREEN}Configuring Hotspot network${NC}"
sudo nmcli con delete Hostspot
sudo nmcli con add type wifi ifname wlan0 con-name Hostspot autoconnect yes ssid Hostspot
sudo nmcli con modify Hostspot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
sudo nmcli con modify Hostspot wifi-sec.key-mgmt wpa-psk
sudo nmcli con modify Hostspot wifi-sec.psk "veryveryhardpassword1234"
sudo nmcli con up Hostspot
echo -e "${GREEN}Hotspot configured!${NC}"


sudo -E apt autoremove -y
sudo systemctl restart firewall
