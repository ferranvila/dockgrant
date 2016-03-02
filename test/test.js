'use strict';

var commonTests = require('../lib/common-tests');
var path = require('path');

describe('dockgrant tests', function () {

    before(function (done) {
        done();
    });

    commonTests.importTest('version tests', path.join(__dirname, './bin/dockgrant-help.js'));
    commonTests.importTest('version tests', path.join(__dirname, './bin/dockgrant-version.js'));

    after(function (done) {
        done();
    });

});
