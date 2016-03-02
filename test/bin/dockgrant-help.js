'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var common = require('app/common');

it('--help should run without errors', function (done) {
    exec(common.getBinPath() + '--help', function (error) {
        assert(!error);
        done();
    });
});

it('--h should run without errors', function (done) {
    exec(common.getBinPath() + '-h', function (error) {
        assert(!error);
        done();
    });
});

it('help should run without errors', function (done) {
    exec(common.getBinPath() + 'help', function (error) {
        assert(!error);
        done();
    });
});

it('should return help on missing command', function (done) {
    exec(common.getBinPath(), function (error) {
        assert(!error);
        done();
    });
});
