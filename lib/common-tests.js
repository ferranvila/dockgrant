'use strict';

module.exports = {

    /**
     * Method for importing a test file to the test suite
     * @param name Name of the test
     * @param path PAth of the file with the tests
     */
    importTest: function (name, path) {
        describe(name, function () {
            require(path);
        });
    }
};
