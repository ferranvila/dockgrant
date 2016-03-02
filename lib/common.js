'use strict';

var path = require('path');

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
                    console.log(_msg);
                }
                break;
            case 'info':
                console.log(_msg);
                break;
            case 'warn':
                console.warn(_msg);
                break;
            case 'error':
                console.error(_msg);
                break;
            default :
                console.error('This debug level is not defined');
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
     */
    isCommandAvailable: function (_command) {

        if (shell.exec(_command, {silent: true}).code !== 0) {
            this.log('error', 'The command <' + _command + '> is not available');
            this.exit(1);
        } else {
            this.log('debug', 'The command <' + _command + '> is available!');
        }
    },

    setLogLevel: function (_level) {
        level = _level;
    },

    getLogLevel: function () {
        return level;
    }

};
