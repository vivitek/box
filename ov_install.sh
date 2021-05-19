#!/usr/bin/env sh
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

sudo -E dpkg --configure -a
echo "Welcome to OpenVVRT! Now commencing installation"

export NODE_ENV="production"
echo '
export AMQP_HOSTNAME=0.0.0.0
export AMQP_USERNAME=vivi
export AMQP_PASSWORD=vivitek
' >> ~/.bashrc
source ~/.bashrc
# # Installing docker
# echo "${GREEN}Removing existing Docker installation${NC}"
# sudo -E apt remove -y docker docker-engine docker.io containerd runc
# echo "${GREEN}Installing Docker dependencies${NC}"
# sudo -E apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
# echo "${GREEN}Adding Docker GPT key${NC}"
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo -E gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# echo "${GREEN}Adding Docker repository${NC}"
# echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo -E tee /etc/apt/sources.list.d/docker.list > /dev/null
# sudo -E apt update
# echo "${GREEN}Installing Docker${NC}"
# sudo -E apt install -y docker-ce docker-ce-cli containerd.io
# echo "${GREEN}Installing docker-compose and seeting permissions${NC}"
# sudo -E apt install -y python3-pip
# sudo -E pip3 install docker-compose

# Installing basic stuff
sudo -E apt install -y network-manager
sudo -E apt install -y python3-pip

# Installing nvm and recommended version
echo "${GREEN}Installing and configuring nodejs${NC}"
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo -E apt install -y nodejs

echo "${GREEN}Installing pm2${NC}"
sudo -E npm i -g pm2@latest
pm2 kill
pm2 startup

# Configuring openvvrt api
echo "${GREEN}Installing and activating API${NC}"
cd ov_api
npm install
sudo -E pm2 start --name ov-api index.js
cd ..

echo "${GREEN}Building baremetal services${NC}"


# Configuring RabbitMQ
echo "${GREEN}Building RabbitMQ ${NC}"
sudo -E apt install -y rabbitmq-server
sudo -E systemctl enable rabbitmq-server
sudo -E systemctl start rabbitmq-server
echo "${GREEN}Activating rabbitmq management plugin${NC}"
sudo -E rabbitmq-plugins enable rabbitmq_management
echo "${GREEN}Creating RabbitMQ User${NC}"
sudo -E rabbitmqctl add_user vivi vivitek
sudo -E rabbitmqctl set_user_tags vivi administrator
sudo -E rabbitmqctl set_permissions -p / vivi ".*" ".*" ".*"


# Configuring postgres
echo "${GREEN}Installing Postgresql services${NC}"
sudo -E apt install -y postgresql postgresql-contrib
SQL_DUMP=$(cat ./postgres/init.sql)
sudo -E chmod +r ./postgres/init.sql
sudo -E -u postgres psql postgres < ./postgres/init.sql


echo "${GREEN}Installing OpenVVRT's services${NC}"
# Configuring firewall
echo "${GREEN}Installing Firewall service dependencies${NC}"
sudo -E apt install -y build-essential libpq-dev procps nftables
echo "${GREEN}Creating firewall systemd${NC}"
cat ./configs/firewall.service.template | sed 's@$PWD@'"$PWD"'@' | sudo -E tee /etc/systemd/system/firewall.service
echo "${GREEN}Installing Firewall service${NC}"
cd firewall
sudo -E pip3 install -r requirements.txt
echo "${GREEN}Starting firewall service${NC}"
python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade
echo "${GREEN}Starting firewall systemd${NC}"
sudo -E systemctl daemon-reload
sudo -E systemctl enable firewall
sudo -E systemctl enable nftables
sudo -E systemctl start nftables
sudo -E systemctl start firewall
cd ..


# Configuring DHCP
echo "${GREEN}Installing DHCP dependencies${NC}"
cd dhcpd
npm install
./node_modules/typescript/bin/tsc
echo "${GREEN}Starting DHCP service${NC}"
sudo -E pm2 start --name dhcp dist/main.js
cd ..


# Configuring GraphQL relay
echo "${GREEN}Installing GraphQl dependencies${NC}"
cd graphql
npm install
./node_modules/typescript/bin/tsc
echo "${GREEN}Starting GraphQl service${NC}"
sudo -E pm2 start --name graphql dist/index.js
cd ..


# Network hotspot configuration
echo "${GREEN}Configuring Hotspot network${NC}"
sudo -E nmcli con delete Hostspot
sudo -E nmcli con add type wifi ifname wlan0 con-name Hostspot autoconnect yes ssid Hostspot
sudo -E nmcli con modify Hostspot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
sudo -E nmcli con modify Hostspot wifi-sec.key-mgmt wpa-psk
sudo -E nmcli con modify Hostspot wifi-sec.psk "veryveryhardpassword1234"
sudo -E nmcli con up Hostspot
echo "${GREEN}Hotspot configured!${NC}"


sudo -E apt autoremove -y