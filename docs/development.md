# Development

## Arch

Each folder is a container. See README.md in each folder for detailed architecture.

## Tools

> VSCode

You can use any IDE you prefer. However we recommend using VSCode.

> Docker

We use `docker-compose` to run everything in containers, because BalenaOS runs the conainers the same way.

> Git and git-flow

We use git as versionning tool. To have clean branches, we use the [git-flow architecture](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). Please read the [conventions](./docs/conventions.md) for branch naming.

> PivotalTracker

Used to create stories. Ask the project responsible to add you to the board. Use the online version.

## Installation

### 1 - Docker installation

```
wget https://get.docker.com/ -O script.sh
chmod +x script.sh
./script.sh
sudo service docker start
```

```
sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` > docker-compose
sudo mv docker-compose /usr/local/bin/
sudo chmod +x /usr/local/bin/docker-compose
sudo docker-compose -v
```

* Enable docker without sudo (valid after reboot)
`sudo usermod -aG docker $USER`

### 2 - git and git-flow

Git `sudo apt install git`

git-flow `sudo apt install git-flow`