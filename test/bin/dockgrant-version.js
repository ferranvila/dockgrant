'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var common = require('app/common');

it('--version should run without errors', function (done) {
    exec(common.getBinPath() + '--version', function (error) {
        assert(!error);
        done();
    });
});

it('-V should run without errors', function (done) {
    exec(common.getBinPath() + '-V', function (error) {
        assert(!error);
        done();
    });
});
