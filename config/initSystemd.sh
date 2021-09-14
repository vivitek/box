#/bin/bash

cat ./config/startOnBoot.service.template | sed 's@$PWD@'$PWD'@' | sudo -E tee /etc/systemd/system/startOnBoot.service
