'use strict';

var common = require('../../lib/common');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var path = require('path');

module.exports = {

    run: function (program, callback) {

        if (program.debug) {
            common.setLogLevel('debug');
        }

        // Pre-requites validation
        common.isCommandAvailable('vagrant -v');

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

        // Create the Vagrantfile using the template
        var store = memFs.create();
        var fs = editor.create(store);
        fs.copyTpl(path.join(__dirname, '../../template/Vagrantfile'), 'Vagrantfile', {key: 'value'});
        fs.commit(function () {
            common.log('info', 'Created a Vagrantfile in your directory!');
            callback();
        });


    }
};
