#!/usr/bin/env node
'use strict';

var program = require('commander');
var pck = require('../package.json');
var common = require('../lib/common');

program
    .version(pck.version)
    .description(pck.description)
    .usage('[command] [options]')
    .command('run [options]', 'Run a command inside a virtual image {vagrant up > vagrant exec}')
    .command('stop [options]', 'Stop a virtual image {vagrant halt}')
    .parse(process.argv);

// Unknown commands
var found = 0;
program.commands.forEach(function (command) {
    program.args.forEach(function (arg) {
        if (command._name === arg) {
            found = 1;
        }
    });
});

if (!found) {
    common.log('error', 'Sub-command not found. Run \'' + __filename.slice(__dirname.length + 1, -3) + ' --help\':');
    common.exit(1);
}
