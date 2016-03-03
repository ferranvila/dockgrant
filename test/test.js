'use strict';

var commonTests = require('../lib/common-tests');
var path = require('path');

describe('dockgrant tests', function () {

    before(function (done) {
        done();
    });

    // TODO: create tests for run command

    commonTests.importTest('version tests', path.join(__dirname, './bin/dockgrant-bin.js'));
    commonTests.importTest('version tests', path.join(__dirname, './bin/dockgrant-help.js'));
    commonTests.importTest('version tests', path.join(__dirname, './bin/dockgrant-version.js'));

    after(function (done) {
        done();
    });

});
