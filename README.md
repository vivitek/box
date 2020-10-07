# Vincipit Router - Deep Thought


### Description

This project is developped by @vivitek as the router part. It contains the multiple containers needed for the router and firewall functionnalities.

Used technologies:
- docker
- typescript/javascript

### Developping

See [contributing guidelines](./holocron/router/contributing.md)
In local, project can be developped in a container using VSCode Dev Container functionnality.

Required for container dev: Docker CE/CC, VSCode, Docker VSCode Extension, Remote - Containers Extension

### Building

As the project need to be built for an arm architecture (aarch64), the TS files will be built locally, then sent and built on BalenaCloud platform, and pushed to devices. The devices will automatically be updated if the build succeeds.

Use `./build.sh` to build and publish project