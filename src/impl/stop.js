'use strict';

var common = require('../../lib/common');
var shell = require('shelljs');

module.exports = {

    /**
     * Method implementation for running the equivalent docker stop on the
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

        shell.exec('vagrant halt', {
            silent: vagrant.quiet
        }, function (code) {
            if (code === 0) {
                common.log('debug', 'The machine was stopped correctlly');
            } else {
                common.log('error', 'The machine stop command finished with an error: ' + code);
            }
            callback(code);
        });

    }
};
