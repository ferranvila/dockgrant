'use strict';

var common = require('../../lib/common');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var store = memFs.create();
var fs = editor.create(store);

module.exports = {

    run: function (program, callback) {

        // TODO: create a temporary directory for creating the VagrantFile
        // Create the VagrantFile

        if(program.debug) {
            common.setLogLevel('debug');
        }

        // Parse the shared volumes (-v host:guest)
        if (program.volume) {
            var volumes = {};
            common.log('debug', 'Program arguments: ' + program.args);
            program.args.forEach(function (arg) {
                var values = arg.split(':');
                volumes[values[0]] = values[1];
            });
            common.log('debug', 'Volumes: ' + JSON.stringify(volumes));
        }

        // Parse the working directory
        if (program.workdir) {
            common.log('debug', 'Working Directory: ' + program.workdir);
        }

        fs.copyTpl('template/Vagrantfile', 'Vagrantfile', {key:'value'});
        fs.commit(function(){
            common.log('info','Created a Vagrantfile in your directory!');
            callback();
        });


    }
};
