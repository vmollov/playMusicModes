module.exports = function(config){
    'use strict';

    config.set({
        basePath : '',
        files : [
            'ui/main.js',
            //'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            //'node_modules/angular-route/angular-route.js',
            'ui/main.js',
            'ui/**/*.mspec.js'
        ],
        exclude: [],
        preprocessors: {
            'ui/main.js': ['browserify'],
            'ui/model/**/*.js': ['browserify']
            //'src/public/js/directives/*.html': ['ng-html2js']
        },
        browserify: {
            baseDir: '',
            //debug: true,
            paths: ['ui/model'],
            bundleDelay: 1000
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/public',
            moduleName: 'templates'
        },
        autoWatch : true,
        singleRun : false,
        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon', 'browserify'],
        browsers : ['Chrome'],
        plugins : [
            'karma-browserify',
            'karma-mocha',
            'karma-chai',
            'karma-chai-as-promised',
            'karma-sinon',
            'karma-chrome-launcher'
        ]
    });
};
