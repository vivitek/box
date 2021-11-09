#!/usr/bin/env bash

eval $(cat /etc/default/openvivi-tunnel) /usr/bin/ssh -N -T -R $VIVIDPORT:localhost:$VIVISPORT $VIVISSH_USER@$VIVISSH_SERVER