'use strict';

require('colors');
var path = require('path');
var shell = require('shelljs');

// Init the local storage
var homeDir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
var localDir = path.join(homeDir, '.dockgrant');
var store = require('data-store')('app', {cwd: localDir});

var level = 'info';

module.exports = {

    /**
     * Method for obtaining a valid ip for running the virtualBox image. The function
     * calculates the ip from the last acquired ip. In order to avoid concurrency problems
     * there is a lock variable to control the acquisition
     * @returns {*} Valid IP
     */
    getIp: function () {

        if (!store.get('ip_lock')) {

            var ip, network;
            var ipRegex = /(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?(?::(\d+))?/ig;

            // Set-up lock
            store.set('ip_lock', true);

            // Get the network configured in store
            var privateNetwork = store.get('private_network');
            if (privateNetwork) {
              var ipParts = ipRegex.exec(privateNetwork);
              network = ipParts[1] + '.' + ipParts[2] + '.' + ipParts[3] + '.';
            } else {
              network = '192.168.1.';
            }

            var lastAcquiredIp = store.get('last_ip');
            if (lastAcquiredIp) {

                var ipRegex = /(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?(?::(\d+))?/ig;
                var ipParts = ipRegex.exec(lastAcquiredIp);
                if (ipParts[4] === '254') {
                    ip = network + '2';
                    this.log('debug', 'Last possible ip, returning to the first one');
                } else {
                    ip = network + ((ipParts[4] % 254) + 1);
                }
            } else {
                this.log('debug', 'No ip defined, setting up the first one');
                ip = network + '2';
            }

            // Release lock
            store.set('last_ip', ip);
            this.log('debug', 'Returning ip: ' + ip);
            store.set('ip_lock', false);

            return ip;

        } else {
            // If the lock is enabled, wait for 100ms and try again
            this.log('warn', 'The lock for las acquired IP is blocking the acquisition. Waiting 100ms');
            setTimeout(this.getIp(), 100);
        }
    },

    /**
     * Generic log function for printing the logs
     * @param _level Level of debug
     * @param _msg Message to print
     */
    log: function (_level, _msg) {

        switch (_level) {
            case 'debug':
                if (this.getLogLevel() === 'debug') {
                    console.log((_msg + '').cyan);
                }
                break;
            case 'warn':
                console.warn((_msg + '').yellow);
                break;
            case 'error':
                console.error((_msg + '').red);
                break;
            default :
                console.log(_msg);
        }
    },

    /**
     * Method for exiting the program with a concrete exit code
     * @param _code Exit code
     */
    exit: function (_code) {
        this.log('debug', 'exiting program with code <' + _code + '>');
        process.exit(_code);
    },

    /**
     * Returns the full execution path of the bin command
     * @returns {string} bin command path
     */
    getBinPath: function () {
        return 'node ' + path.join(__dirname, '../src/dockgrant.js') + ' ';
    },

    /**
     * Function for testing if a concrete command is installed on the system
     * @param _command Command to test
     * @param _program Installed program
     */
    isCommandAvailable: function (_command, _program) {

        if (shell.exec(_command, {silent: true}).code !== 0) {
            this.log('error', 'The command <' + _program + '> is not available');
            this.exit(1);
        } else {
            this.log('debug', 'The command <' + _program + '> is available!');
        }
    },

    /**
     * Method for converting an array to a javascript object
     * @param arr Array
     * @returns {{}} Object with the values
     */
    toObject: function (arr) {
        var rv = {};
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] !== undefined) {
                rv[i] = arr[i];
            }
        }
        return rv;
    },

    /**
     * Sets the log level of the application
     * @param _level Level of log
     */
    setLogLevel: function (_level) {
        level = _level;
    },

    /**
     * Returns the log level of the application
     * @returns {string}
     */
    getLogLevel: function () {
        return level;
    }

};
