#! /usr/bin/env node --harmony

'use strict';

var program = require('commander');
var common = require('../lib/common');

program
    .alias('dockgrant')
    .usage('rm [options]')
    .description('Remove a virtual image {vagrant destroy}')
    .option('-p, --path [path]', 'Working directory {unique}', null, null)
    .option('-q, --quiet', 'Quiet mode', null, null)
    .option('-f, --force', 'Force the destroy', null, null)
    .option('-d, --debug', 'Enable verbose mode', null, null)
    .parse(process.argv);


if (program.debug) {
    common.log('debug', 'Enabling debug level');
    common.setLogLevel('debug');
}

/*
 --------------------------------------------------------------------------------
 Program execution
 --------------------------------------------------------------------------------
 */

var vagrant = {
    path: '.',
    quiet: false,
    force: false
};

// Quiet mode
if (program.quiet) {
    vagrant.quiet = true;
}

// Working path
if (program.path) {
    vagrant.path = program.path;
}

// Force mode
if (program.force) {
    vagrant.force = true;
}

require('./impl/rm').run(vagrant, function () {

    common.exit(0);
});
