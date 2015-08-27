'use strict';

require('angular');
require('angular-route');


module.exports = angular.module('playMusicModes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);
