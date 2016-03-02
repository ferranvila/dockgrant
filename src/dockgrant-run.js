#! /usr/bin/env node --harmony
'use strict';

var program = require('commander');
var common = require('../lib/common');


var imageArg, shArg;

program
    .alias('dockgrant')
    .usage('run [options] [image] [test]')
    .action(function (image, test) {
        common.log('info',image);
        common.log('info',test);
        imageArg = image;
        shArg = test;
    })
    .description('Run a command inside a virtual image')
    .option('-v, --volume host:guest', 'Share a host folder into the guest', null, null)
    .option('-w, --workdir [workdir]', 'Working directory inside the virtual image', null, null)
    .option('-d, --debug', 'Enable verbose mode', null, null)
    .parse(process.argv);

if (typeof imageArg === 'undefined') {
    common.log('error', 'The attribute <image> is not defined');
    common.exit(1);
}
if (shArg) {
    common.log('error', 'The attribute <sh> is not defined');
    common.exit(1);
}

require('./impl/run').run(program, function () {

});
