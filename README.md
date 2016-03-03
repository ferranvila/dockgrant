# dockgrant 

[![Travis branch](https://img.shields.io/travis/ferranvila/dockgrant/master.svg)](https://travis-ci.org/ferranvila/dockgrant) [![Npm version](http://img.shields.io/npm/v/dockgrant.svg)](https://www.npmjs.com/package/dockgrant) [![Dependency Status](http://img.shields.io/david/ferranvila/dockgrant.svg)](https://david-dm.org/ferranvila/dockgrant) 

> Run vagrant commands like docker syntax

Just for fun! Or not... I created a command line tool to run [vagrant](https://www.vagrantup.com/) commands like the [docker](https://www.docker.com/) syntax. Maybe you could find this stupid... But I have done [Because I can](https://github.com/krzyzanowskim/CryptoSwift#why)!!! :P

## Pre-requisites

## Getting Started

Install this globally and you'll have access to the dockgrant command anywhere on your system.

```shell
npm install -g dockgrant
```

After the installation you should create an empty folder to create your Vagrantfile and execute the vagrant commands.
 
```shell
mkdir /tmp/my-test
cd /tmp/my-test

dockgrant run \
    --volume data:/data \
    --rm \
    --workdir /data \
    --image hashicorp/precise64 \
    --script "pwd && ls -la && cat file"
```
