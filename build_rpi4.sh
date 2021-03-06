 #!/usr/bin/env sh

echo -e "Building containers in emulated containers"
sudo balena build --deviceType raspberrypi3-64 --arch aarch64 --emulated --debug
