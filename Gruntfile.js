'use strict';

var time = require('time-grunt');
var load = require('load-grunt-tasks');

module.exports = function (grunt) {

    time(grunt);
    load(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'node_modules/app/**/*.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        mochaTest: {
            all: {
                options: {reporter: 'spec'},
                src: ['test/test.js']
            }
        }

    });

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['test']);
};
