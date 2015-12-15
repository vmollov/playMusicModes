'use strict';

module.exports = function (app) {
    app.factory('Scale', function(){
        return require('../model/scaleFactory');
    });
};