#! /usr/bin/env node --harmony

'use strict';

var program = require('commander');
var common = require('../lib/common');

program
    .alias('dockgrant')
    .usage('stop [options]')
    .description('Stop a virtual image {vagrant halt}')
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
    quiet: false
};

// Quiet mode
if (program.quiet) {
    vagrant.quiet = true;
}

require('./impl/stop').run(vagrant, function () {

    common.exit(0);
});
