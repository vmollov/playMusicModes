'use strict';

module.exports = function(app){
    app.controller('homeCtrl', ['$scope',
        function($scope){
            console.log('home');
        }
    ]);
};