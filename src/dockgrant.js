#!/usr/bin/env node
'use strict';

var program = require('commander');
var pck = require('../package.json');

program
    .version(pck.version)
    .description(pck.description)
    .command('run', 'run command')
    .parse(process.argv);
