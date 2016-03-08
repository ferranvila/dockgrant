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

## Examples

```shell
dockgrant run --rm --image hashicorp/precise64 --script "uname -a" -q
```
will output `Linux precise64 3.2.0-23-generic #36-Ubuntu SMP Tue Apr 10 20:39:51 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux`

```shell
vf=/tmp/dockgrant-sample &&\
mkdir -p ${vf}/data &&\
echo "echo hello \$VAR" > ${vf}/data/script.sh &&\
chmod +x ${vf}/data/script.sh  &&\
dockgrant run --rm --path ${vf} --volume ${vf}/data:/data --workdir /data -e VAR=world --image hashicorp/precise64 --script "sh script.sh" -q
```
will output `hello world`

