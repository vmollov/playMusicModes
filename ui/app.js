'use strict';

var angular = require('angular');

//load angular modules
require('angular-route');

module.exports = function(moduleName){
    var app = angular.module(moduleName, ['ngRoute']);

    require('./services/wrappers')(app); //model wrappers for angular

    //views
    require('./views/home')(app);
    require('./views/testing')(app);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/views/home.html',
            controller: 'homeCtrl'
        });
        $routeProvider.when('/testing', {
            templateUrl: '/views/testing.html',
            controller: 'testingCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/'});
    }]);

    return app;
};
