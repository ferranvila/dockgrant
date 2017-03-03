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

        var self = this;

        // Pre-requites validation
        common.isCommandAvailable('vagrant -v', 'vagrant');
        common.isCommandAvailable('vagrant plugin list | grep vagrant-exec', 'vagrant-exec');
        common.isCommandAvailable('vagrant plugin list | grep vagrant-cachier', 'vagrant-cachier');

        if (vagrant.path !== '.') {

            common.checkPath(vagrant.path);

            shell.exec('mkdir -p ' + vagrant.path, {
                async: true,
            }, function (code, stdout, stderr) {
                if (code !== 0) {
                    common.log('error', 'ERROR(' + code + '): The path folder creation was not executed correcttlly:' + stderr);
                    callback(code);
                }
            });
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
            //common.log('debug', '---------\n' + shell.exec('cat Vagrantfile', {silent: true}).stdout + '---------');

            // Change the running directory
            process.chdir(vagrant.path);

            // Bringing up the vagrant machine
            common.log('debug', 'Creating the machine...');
            shell.exec('vagrant up', {
                async: true,
                silent: vagrant.quiet
            }, function (code, stdout, stderr) {

                if (code !== 0) {
                    // ERROR creating the machine
                    common.log('error', 'ERROR(' + code + '): Creating the machine:' + stderr);
                    self.destroy(vagrant, code, callback);
                } else {
                    common.log('debug', 'Machine created!');
                    // Changing the working directory & Execute the command

                    vagrant.command = vagrant.command.replace(/"/g, '\\\"'); // Fix #18 Escape double quotes inside the vagrant command
                    common.log('debug', 'Executing the commands...');
                    shell.exec('vagrant exec \"' + vagrant.command + '\"', {
                        async: true,
                        timeout: 60 * 60 * 1000 // timeout for executing the comands
                    }, function (code, stdout, stderr) {

                        if (code !== 0) {
                            // ERROR executing commands
                            common.log('error', 'ERROR(' + code + '): Executing commands:' + stderr);
                            self.destroy(vagrant, code, callback);
                        } else {
                            common.log('debug', 'Commands executed! ' + vagrant.command);
                            if (vagrant.deleteImage) {
                                self.destroy(vagrant, code, callback);

                            } else {
                                callback(code);
                            }
                        }
                    });
                }
            });
        });
    },

    /**
     * Method for destroying the machine in case of error or when the
     * commands are executed
     * @param vagrant {Object} Vagrant object with all the information for the run
     * @param code {number} Exit code from the previous execution
     * @param callback {Method} Callback for execution at the end of the run
     */
    destroy: function (vagrant, code, callback) {

        common.log('debug', 'Destroying the machine...');
        shell.exec('vagrant destroy -f', {
            async: true,
            silent: vagrant.quiet
        }, function () {
            common.log('debug', 'Machine destroyed!');
            callback(code);
        });
    }
};
