'use strict';

var app = require('./app')('playMusicModes');

//adjust for browser differences
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;

app.factory('Scale', function(){
    return require('./model/scale');
});

//load views
require('./views/home')(app);
require('./views/testing')(app);