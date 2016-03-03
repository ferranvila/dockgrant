'use strict';

var common = require('../../lib/common');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var path = require('path');
var shell = require('shelljs');

module.exports = {

    run: function (vagrant, callback) {

        // Pre-requites validation
        common.isCommandAvailable('vagrant -v', 'vagrant');
        common.isCommandAvailable('vagrant plugin list | grep vagrant-exec', 'vagrant-exec');
        common.isCommandAvailable('vagrant plugin list | grep vagrant-cachier', 'vagrant-cachier');

        if (vagrant.path !== '.') {
            shell.exec('mkdir -p ' + vagrant.path);
        }

        // Create the Vagrantfile using the template
        var store = memFs.create();
        var fs = editor.create(store);
        fs.copyTpl(path.join(__dirname, '../../template/Vagrantfile'), path.join(vagrant.path, 'Vagrantfile'), {
            image: vagrant.image_name,
            volumes: vagrant.volumes,
            image_url: vagrant.image_url
        });
        fs.commit(function () {
            common.log('debug', 'Created a Vagrantfile!');
            common.log('debug', '---------\n' + shell.exec('cd ' + vagrant.path + ' && cat Vagrantfile', {silent: true}).stdout + '---------');
            callback();
        });

        // Bringing up the vagrant machine
        var child = shell.exec('cd ' + vagrant.path + ' && vagrant up', {async: true, silent: vagrant.quiet});
        child.stdout.on('end', function () {

            common.log('debug', 'Vagrant up finished!');

            // Changing the working directory & Execute the command
            child = shell.exec('cd ' + vagrant.path + ' && vagrant exec \"cd ' + vagrant.working_directory + ' && ' + vagrant.command + '\"', {async: true});
            child.stdout.on('end', function () {
                if (vagrant.delete_image) {

                    common.log('debug', 'Destroying the machine');
                    child = shell.exec('cd ' + vagrant.path + ' && vagrant destroy -f', {
                        async: true,
                        silent: vagrant.quiet
                    });
                }
            });
        });

    }
};
