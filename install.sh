git clone https://github.com/vivitek/box.git
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
sudo dpkg --configure -a
bash
nvm install 14
cd box
npm i
node create-openvvrt.js
