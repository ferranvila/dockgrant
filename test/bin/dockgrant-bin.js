'use strict';

var exec = require('child_process').exec;
var assert = require('assert');
var common = require('../../lib/common');

it('should return error on unknown command', function (done) {
    exec(common.getBinPath() + 'junkcmd', function (error) {
        assert(error);
        assert.equal(error.code, 1);
        done();
    });
});
