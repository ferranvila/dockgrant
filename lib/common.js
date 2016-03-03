'use strict';

require('colors');
var path = require('path');
var shell = require('shelljs');

var level = 'info';

module.exports = {

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
            case 'info':
                console.log(_msg);
                break;
            case 'warn':
                console.warn((_msg + '').yellow);
                break;
            case 'error':
                console.error((_msg + '').red);
                break;
            default :
                console.error(('This level of log is not defined').red);
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
            this.log('debug', 'The command <' + _command + '> is available!');
        }
    },

    /**
     * Method for converting an array to a javascript object
     * @param arr Array
     * @returns {{}} Object with the values
     */
    toObject: function (arr) {
        var rv = {};
        for (var i = 0; i < arr.length; ++i)
            if (arr[i] !== undefined) rv[i] = arr[i];
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
