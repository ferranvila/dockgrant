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

            if (!vagrant.path.startsWith('/')){
                common.log('error', 'The path varibale should be absolute');
                callback(1);
            }

            shell.exec('mkdir -p ' + vagrant.path);
            // Change the running directory
            process.chdir(vagrant.path);
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

            // Bringing up the vagrant machine
            common.log('debug', 'Creating the machine');
            shell.exec('vagrant up', {async: true, silent: vagrant.quiet}, function(code){

                if (code !== 0) {
                    // ERROR creating the machine
                    common.log('error', 'Creating the machine exit code: ' + code);
                    callback(code);
                }

                // Changing the working directory & Execute the command
                vagrant.command = vagrant.command.replace(/"/g, '\\\"'); // Fix #18 Escape double quotes inside the vagrant command
                common.log('debug', 'Executing the commands');
                shell.exec('vagrant exec \"' + vagrant.command + '\"', {async: true}, function (code) {

                    if (code !== 0) {
                        // ERROR creating the machine
                        common.log('error', 'Executing the commands exit code: ' + code);
                        common.log('warn', 'Destroying the machine because the command is incorrect');
                        shell.exec('vagrant destroy -f', {async: true, silent: vagrant.quiet}, function (destroyCode) {
                            common.log('debug', `Destroy command finished with code ${destroyCode}`);
                            callback(code);
                        });
                        callback(code);
                    }

                    if (vagrant.deleteImage) {

                        common.log('debug', 'Destroying the machine');
                        shell.exec('vagrant destroy -f', {async: true, silent: vagrant.quiet}, function (destroyCode) {
                            common.log('debug', `Destroy command finished with code ${destroyCode}`);
                            callback(code);
                        });

                    } else {
                        callback(code);
                    }
                });
            });
        });

    }
};
