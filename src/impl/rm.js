'use strict';

var common = require('../../lib/common');
var shell = require('shelljs');

module.exports = {

    /**
     * Method implementation for running the equivalent docker rm on the
     * vagrant syntax
     * @param callback Callback for execution at the end of the run
     */
    run: function (vagrant, callback) {

        // Pre-requites validation
        common.isCommandAvailable('vagrant -v', 'vagrant');

        if (vagrant.path !== '.') {
            common.checkPath(vagrant.path);
            // Change the running directory
            process.chdir(vagrant.path);
        }

        shell.exec(vagrant.force ? 'vagrant destroy --force' : 'vagrant destroy', {
            silent: vagrant.quiet
        }, function (code) {
            if (code === 0) {
                common.log('debug', 'The machine was removed correctlly');
            } else {
                common.log('error', 'The machine remove command finished with an error: ' + code);
            }
            callback(code);
        });

    }
};
