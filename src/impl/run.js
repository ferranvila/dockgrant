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
            image_url: vagrant.image_url,
            working_dir: vagrant.working_directory,
            env_vars: vagrant.env_vars
        });
        fs.commit(function () {
            common.log('debug', 'Created a Vagrantfile!');
            common.log('debug', '---------\n' + shell.exec('cd ' + vagrant.path + ' && cat Vagrantfile', {silent: true}).stdout + '---------');

            // Bringing up the vagrant machine
            var cmd = 'cd ' + vagrant.path + ' && vagrant up';
            common.log('debug', cmd);
            var child = shell.exec(cmd, {async: true, silent: vagrant.quiet});
            child.stdout.on('end', function () {

                common.log('debug', 'Vagrant up finished!');

                // Changing the working directory & Execute the command
                var cmd = 'cd ' + vagrant.path + ' && vagrant exec \"' + vagrant.command + '\"';
                common.log('debug', cmd);
                child = shell.exec(cmd, {async: true});
                child.stdout.on('end', function () {
                    if (vagrant.delete_image) {

                        common.log('debug', 'Destroying the machine');
                        var cmd = 'cd ' + vagrant.path + ' && vagrant destroy -f';
                        common.log('debug', cmd);
                        child = shell.exec(cmd, {async: true, silent: vagrant.quiet});
                        child.stdout.on('end', function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            });
        });

    }
};
