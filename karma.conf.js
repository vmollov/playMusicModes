module.exports = function(config){
    'use strict';
    config.set({

        basePath : './',

        files : [
            'node_modules/angular/angular.js',
            'node_modules/angular-route/angular-route.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'ui/directives/**/*.js',
            'ui/views/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['mocha', 'chai', 'sinon'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'unit.xml',
            suite: 'unit'
        }

    });
};
