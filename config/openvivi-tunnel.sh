#!/usr/bin/env bash
eval $(ssh-agent -s)
ssh-add /home/ubuntu/.ssh/id_tunnel
/usr/bin/ssh -o StrictHostKeyChecking=accept-new -N -T -R 43769:localhost:3000 tunnel@api.openvivi.com