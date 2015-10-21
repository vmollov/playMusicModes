'use strict';

require('angular');
require('angular-route');

module.exports = function(moduleName){
    return angular.module(moduleName, ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
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
};
