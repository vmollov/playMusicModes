'use strict';

require('./app')('playMusicModes');

//adjust for browser differences
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;

