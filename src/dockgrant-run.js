'use strict';

var program = require('commander');

program
    .option('-v, --volume host:guest', 'Share a host folder into the guest', null, null)
    .option('-w, --workdir [workdir]', 'Working directory inside the virtual image', null, null)
    .option('-d, --debug', 'Enable verbose mode', null, null)
    .parse(process.argv);

require('./impl/run').run(program, function () {

});
