'use strict';

var common = require('../../lib/common');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var path = require('path');

module.exports = {

    run: function (vagrant, callback) {

        // Pre-requites validation
        common.isCommandAvailable('vagrant -v');

        // Create the Vagrantfile using the template
        var store = memFs.create();
        var fs = editor.create(store);
        fs.copyTpl(path.join(__dirname, '../../template/Vagrantfile'), 'Vagrantfile', {
            image: vagrant.image_name,
            volumes: vagrant.volumes
        });
        fs.commit(function () {
            common.log('info', 'Created a Vagrantfile in your directory!');
            common.log('debug', '---------\n' + common.exec('cat Vagrantfile') + '---------');
            callback();
        });

        // TODO: Vagrant up
        // TODO: Change the working directory
        // TODO: Execute the command
        // TODO: Delete the image


    }
};
