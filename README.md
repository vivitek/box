# VIVI

## Prerequisites
```
ubuntu server 20.04
```

## Configuration
```
git clone https://github.com/vivitek/box.git
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
bash
nvm use 14
cd box
npm i
node create-openvvrt.js
```

## Architecture
![VIVI schema](/assets/VIVI.png)

## Troubleshooting
In you encounter any problems, you can contact us using the [discussion](https://github.com/vivitek/box/discussions) tab or by creating an issue [here](https://github.com/vivitek/box/issues)

---
## License
See [LICENSE](LICENSE)