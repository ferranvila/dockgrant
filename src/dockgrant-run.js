'use strict';

var program = require('commander');
var common = require('../lib/common');

program
    .parse(process.argv);

common.log('run');
