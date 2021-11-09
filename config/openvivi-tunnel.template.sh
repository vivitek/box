#!/usr/bin/env bash
eval $(ssh-agent -s)
ssh-add /home/ubuntu/.ssh/id_tunnel
/usr/bin/ssh -o StrictHostKeyChecking=accept-new -N -T -R $VIVIDPORT:localhost:$VIVISPORT $VIVISSH_USER@$VIVISSH_SERVER