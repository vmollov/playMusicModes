'use strict';

var
    app = require('./app')('playMusicModes');

//adjust for browser differences
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;

//load views
require('./views/home')(app);