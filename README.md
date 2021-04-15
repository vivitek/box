# Box

##

[![Build Status](https://travis-ci.com/vivitek/box.svg?branch=master)](https://travis-ci.com/vivitek/monitoring-app)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Discord](https://img.shields.io/discord/827167614018650152)](https://discord.gg/SMYDdZfPG6)

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

this application is the client dashboard used to interact with the [Server](https://github.com/vivitek/backend) and [Devices](https://github.com/vivitek/deep-thought)

## Tech Stack

- NodeJS
- Apollo (GraphQl)
- Python3
- NetFilter
- Balena OS

## Running it

This application is based around a docker-compose file. In order to run it, you will need a [Balena-compatible device](https://www.balena.io/os/?) and [Balena-CLI](https://github.com/balena-io/balena-cli).

Then install a version of balena-os on your device by registering an application on their [dashboard](https://dashboard.balena-cloud.com/apps)

Once that is done, you can then plug your device into the same network as your computer and use balena-cli to deploy your local changes to the machine by using `balena deploy <device_ip_or_url>`