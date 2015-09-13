module.exports = function(config){
    'use strict';
    config.set({

        basePath : '',

        files : [
            'node_modules/requirejs/require.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-route/angular-route.js',
            'ui/services/**/*.js',
            'ui/directives/**/*.js',
            'ui/views/**/*.js',
            'ui/**/*.mspec.js'
        ],

        exclude: [
        ],

        preprocessors: {
            'src/public/js/directives/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/public',
            moduleName: 'templates'
        },

        autoWatch : true,

        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon'],
        //frameworks: ['mocha', 'chai-as-promised', 'sinon', 'sinon-chai', 'chai'],

        browsers : ['Chrome'],

        plugins : [
            'karma-mocha',
            'karma-chai',
            'karma-chai-as-promised',
            'karma-sinon',
            'karma-chrome-launcher',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: 'unit.xml',
            suite: 'unit'
        }

    });
};
