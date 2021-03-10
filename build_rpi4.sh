 #!/usr/bin/env sh

echo -e "Building containers in emulated containers for rpi4"
balena build --deviceType raspberrypi3-64 --arch aarch64 --emulated -m
