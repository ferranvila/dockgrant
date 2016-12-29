#! /usr/bin/env node --harmony
'use strict';

var program = require('commander');
var common = require('../lib/common');

program
    .alias('dockgrant')
    .usage('run [options]')
    .description('Run a command inside a virtual image {vagrant up > vagrant exec}')
    .option('-p, --path [path]', 'Working directory {unique}', null, null)
    .option('-i, --image [image]', 'Image name {unique} - [mandatory]', null, null)
    .option('-u, --imageurl [imageurl]', 'Image url for pulling from catalog {unique}', null, null)
    .option('-s, --script [script]', 'Command to execute inside the guest {unique} - [mandatory]', null, null)
    .option('-v, --volume [host:guest]', 'Share a host folder into the guest {multiple}', null, null)
    .option('-e, --env [key=value]', 'Share a env var into the guest {multiple}', null, null)
    .option('-w, --workdir [workdir]', 'Working directory inside the virtual image {unique}', null, null)
    .option('-q, --quiet', 'Quiet mode', null, null)
    .option('-r, --rm', 'Remove the image after execution', null, null)
    .option('-d, --debug', 'Enable verbose mode', null, null)
    .parse(process.argv);

//common.log('info', program);

if (program.debug) {
    common.log('debug', 'Enabling debug level');
    common.setLogLevel('debug');
}

/*
 --------------------------------------------------------------------------------
 Arguments Parsing
 --------------------------------------------------------------------------------
 */

var vagrant = {
    path:'.',
    quiet: false,
    deleteImage: false,
    workingDirectory: '/vagrant',
    imageName: '',
    imageUrl: '',
    command: '',
    volumes: [],
    envVars: []
};

// Image name
if (program.image) {
    vagrant.imageName = program.image;
} else {
    common.log('error', 'You have to define a image to use');
    common.exit(1);
}

// Command
if (program.script) {
    vagrant.command = program.script;
} else {
    common.log('error', 'You have to define a script to execute inside the image');
    common.exit(1);
}

// Delete image
if (program.rm) {
    vagrant.deleteImage = true;
} else {
    common.log('warn', 'The image will not be destroyed after the execution');
}

// Quiet mode
if (program.quiet) {
    vagrant.quiet = true;
}

// Working path
if (program.path) {
    vagrant.path = program.path;
}

// Image url
if (program.imageurl) {
    vagrant.imageUrl = program.imageurl;
}

// Guest working directory
if (program.workdir) {
    vagrant.workingDirectory = program.workdir;
} else {
    common.log('debug', 'The working dir will be the default: ' + vagrant.workingDirectory);
}

// Parse the shared volumes (-v host:guest)
if (program.volume) {
    program.rawArgs.forEach(function (arg, i) {

        if(arg === '-v' || arg === '--volume') {
            var values = program.rawArgs[i+1].split(':');
            if(values.length !== 2) {
                common.log('error', 'The shared volumes has no host:guest format');
                common.exit(1);
            }
            vagrant.volumes.push(common.toObject(values));
        }
    });
}

// Parse the env variables (-e key=value)
if (program.volume) {
    program.rawArgs.forEach(function (arg, i) {

        if(arg === '-e' || arg === '--env') {
            var values = program.rawArgs[i+1].split('=');
            if(values.length !== 2) {
                common.log('error', 'The env vars has no key=value format');
                common.exit(1);
            }
            vagrant.envVars.push(common.toObject(values));
        }
    });
}

common.log('debug', 'Program execution: ' + JSON.stringify(vagrant, null, 4));

/*
 --------------------------------------------------------------------------------
 Program execution
 --------------------------------------------------------------------------------
 */

require('./impl/run').run(vagrant, function (code) {

    common.exit(code);
});
