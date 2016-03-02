'use strict';

var program = require('commander');
var common = require('app/common');

program
    .parse(process.argv);

common.log('run');
