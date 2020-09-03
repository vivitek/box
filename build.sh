##
## Vincipit
## Building containers
##

#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
NC='\033[0m'

echo -e "${ORANGE}## BUILDING PROJECT FOR BALENA OS ${NC}##"

# Building typescript containers
containers="container"
for container in containers; do
  cd container
  yarn build
  if [ $? -eq 1 ]; then
    echo -e "${RED}XXX ERROR BUILDING TS IN ${ORANGE}${container}${RED} XXX${NC}"
    exit 1
  fi
  cd ..
done
echo -e "${GREEN}[][][] Done ! [][][]${NC}"

# Building on Balena cloud
echo -e "${ORANGE}Building containers on BalenaCloud${NC}"

balena push VincipitRouter
if [ $? -eq 1 ]; then
  echo -e "${RED}XXX ERROR BUILDING CONTAINER ON BALENACLOUD XXX${NC}"
  exit 1
fi
echo -e "${GREEN}[][][] Done ! [][][]${NC}"