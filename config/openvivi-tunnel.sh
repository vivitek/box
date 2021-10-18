#!/bin/bash

/usr/bin/ssh -N -T -R $VIVIDPORT:localhost:$VIVISPORT $VIVISSH_USER@$VIVISSH_SERVER