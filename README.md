# Vincipit Router - Deep Thought


### Description

This project is developped by @vivitek as the router part. It contains the multiple containers needed for the router and firewall functionnalities.
The router is divided into 3 main containers : 
- DHCP: that will bind new user trying to connect to IP addresses
- PCAP: that will analyze the traffic to identify the services used on the network
- MSG-BROKER: that will take care of the communication with the VIVI server/backend

### Developping

In local, project can be developped in a container using VSCode Dev Container functionnality. Required for container dev: Docker CE/CC, VSCode, Docker VSCode Extension, Remote - Containers Extension

Otherwise, launch with `./tools/run-dev` and pass your docker-compose args to the script. Example: `./tools/run-dev up -d container`

### Building - ONLY TO DEPLOY TO BALENA CLOUD

As the project need to be built for an arm architecture (aarch64), the TS files will be built locally, then sent and built on BalenaCloud platform, and pushed to devices. The devices will automatically be updated if the build succeeds.

Use `./tools/build` to build and publish project, *for balena cloud* ! To launch project in dev env, see above

### For Further Informations and List of features, see the notions page:

[Notion.so page](https://www.notion.so/Router-Documentation-ad17245885474d3686ae4fd085f3e130)