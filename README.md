[![Build Status](https://travis-ci.com/vivitek/deep-thought.svg?branch=develop)](https://travis-ci.com/vivitek/deep-thought)

# Router - Version 0.1
========

## Project

This project is part of [VIVI](https://vincipit.com/). This repository contains all the containers pushed on the routers.

## Documentation

Please read the [development](./holocron/routerDocs/development.md) which will teach you how the tools we use, and how the repository is organised.

Please also read the [Conventions](./holocron/routerDocs/conventions.md) which will tell you how to give good, readable code, good branch naming (bad named branches will _NOT_ be merged, and PRs _will be refused_ ).

## Internal Tools

> Setup

After cloning the repo, please run this. It will init gitflow, and install the prettier hook in your local repo

## External Tools

We don't have an install script yet so please install the following programs/plugins.

> Docker

We use `docker-compose` to run everything in containers, because BalenaOS runs the conainers the same way.

> Git and git-flow

We use git as versionning tool. To have clean branches, we use the [git-flow architecture](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). Please read the [conventions](./holocron/routerDocs/conventions.md) for branch naming.

Install git: `sudo apt-get install git`

Install git-flow: `sudo apt-get install git-flow`

Do not forget to run `git flow init` after cloning repository.

> PivotalTracker

Used to create stories. Ask the project responsible to add you to the board.

## Tests

We do not have testing yet. See in future releases.
