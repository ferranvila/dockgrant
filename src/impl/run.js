'use strict';

var common = require('../../lib/common');

var memFs = require('mem-fs');
var editor = require('mem-fs-editor');
var path = require('path');
var shell = require('shelljs');

module.exports = {

    /**
     * Method implementation for running the equivalent docker run on the
     * vagrant syntax
     * @param vagrant Vagrant object with all the information for the run
     * @param callback Callback for execution at the end of the run
     */
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
            image: vagrant.imageName,
            volumes: vagrant.volumes,
            imageUrl: vagrant.imageUrl,
            workingDir: vagrant.workingDirectory,
            envVars: vagrant.envVars,
            ip: common.getIp()
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
                vagrant.command = vagrant.command.replace(/"/g,'\\\"'); // Fix #18 Escape double quotes inside the vagrant command
                var cmd = 'cd ' + vagrant.path + ' && vagrant exec \"' + vagrant.command + '\"';
                common.log('debug', cmd);
                child = shell.exec(cmd, {async: true});
                child.stdout.on('end', function () {
                    if (vagrant.deleteImage) {

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
