#!/bin/bash
sudo rm /etc/systemd/system/openvivi.service
cat ./config/openvivi.service.template | sed 's@$PWD@'$PWD'@' | sudo -E tee /etc/systemd/system/openvivi.service
