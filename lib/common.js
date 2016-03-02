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
     * Returns the full execution path of the bin command
     * @returns {string} bin command path
     */
    getBinPath: function () {
        return 'node ' + path.join(__dirname, '../src/dockgrant.js') + ' ';
    },

    setLogLevel: function (_level) {
        level = _level;
    },

    getLogLevel: function () {
        return level;
    }

};
