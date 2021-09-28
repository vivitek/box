#!/bin/bash

cat ./config/firewall.service.template | sed 's@$PWD@'$PWD'@' | sudo -E tee /etc/systemd/system/firewall.service
