# dockgrant 

[![Travis branch](https://img.shields.io/travis/ferranvila/dockgrant/master.svg)](https://travis-ci.org/ferranvila/dockgrant) [![Npm version](http://img.shields.io/npm/v/dockgrant.svg)](https://www.npmjs.com/package/dockgrant) [![Dependency Status](http://img.shields.io/david/ferranvila/dockgrant.svg)](https://david-dm.org/ferranvila/dockgrant) [![Code Climate](https://img.shields.io/codeclimate/github/ferranvila/dockgrant.svg)](https://codeclimate.com/github/ferranvila/dockgrant) [![Codacy Badge](https://api.codacy.com/project/badge/grade/73f89de1c45e4eee8cea025cde851bb7)](https://www.codacy.com/app/fnva/dockgrant) [![Inline docs](http://inch-ci.org/github/ferranvila/dockgrant.svg?branch=master)](http://inch-ci.org/github/ferranvila/dockgrant)  

> Run vagrant commands like docker syntax

Just for fun! Or not... I created a command line tool to run [vagrant](https://www.vagrantup.com/) commands like the [docker](https://www.docker.com/) syntax. Maybe you could find this stupid... But I have done [Because I can](https://github.com/krzyzanowskim/CryptoSwift#why)!!! :P

## Pre-requisites

- Vagrant https://www.vagrantup.com/
- Vagrant exec plugin https://github.com/p0deje/vagrant-exec
- Vagrant cachier plugin https://github.com/fgrehm/vagrant-cachier
- VirtualBox https://www.virtualbox.org/

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

### ROOT PRIVILEGE REQUIREMENT

https://www.vagrantup.com/docs/synced-folders/nfs.html

To configure NFS, Vagrant must modify system files on the host. Therefore, at some point during the vagrant up sequence, you may be prompted for administrative privileges (via the typical sudo program). These privileges are used to modify ``/etc/exports`` as well as to start and stop the NFS server daemon.`


