#!/bin/bash
sudo rm -f /etc/default/openvivi-tunnel
cat /tmp/openvivi-tunnel | sudo -E tee /etc/default/openvivi-tunnel

