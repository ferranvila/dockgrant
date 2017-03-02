#! /usr/bin/env node --harmony

'use strict';

var program = require('commander');
var common = require('../lib/common');

program
    .alias('dockgrant')
    .usage('stop [options]')
    .description('Stop a virtual image {vagrant halt}')
    .option('-p, --path [path]', 'Working directory {unique}', null, null)
    .option('-q, --quiet', 'Quiet mode', null, null)
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
    quiet: false
};

// Quiet mode
if (program.quiet) {
    vagrant.quiet = true;
}

// Working path
if (program.path) {
    vagrant.path = program.path;
}

require('./impl/stop').run(vagrant, function () {

    common.exit(0);
});
