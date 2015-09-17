module.exports = function(config){
    'use strict';

    config.set({
        basePath : '',
        files : [
            //'ui/main.js',
            //'node_modules/angular/angular.js',
            //'node_modules/angular-mocks/angular-mocks.js',
            //'node_modules/angular-route/angular-route.js',
            //'ui/main.js',
            'ui/**/*.mspec.js'
        ],
        exclude: [],
        preprocessors: {
            //'ui/main.js': ['browserify'],
            'ui/model/**/*.mspec.js': ['browserify']
            //'src/public/js/directives/*.html': ['ng-html2js']
        },
        browserify: {
            debug: true
            //plugin: ['proxyquire']
            /*configure: function(bundle) {
                bundle
                    .plugin(proxyquire.plugin)
                    .require(require.resolve('ui/model'), { entry: true });

            }*/
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: 'src/public',
            moduleName: 'templates'
        },
        autoWatch : false,
        singleRun : true,
        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon', 'browserify'],
        browsers : ['PhantomJS'],
        reporters: ['spec'],
        loggers: []
        /*plugins : [
            'karma-browserify',
            'karma-mocha',
            'karma-chai',
            'karma-chai-as-promised',
            'karma-sinon',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-spec-reporter'
        ]*/
    });
};
