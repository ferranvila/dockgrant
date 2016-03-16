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

        var cmd;
        if(vagrant.force) {
            cmd = 'vagrant destroy --force'
        } else {
            cmd = 'vagrant destroy'
        }
        var child = shell.exec(cmd, {async: true, silent: vagrant.quiet});
        child.stdout.on('end', function () {
            callback();
        });

    }
};
