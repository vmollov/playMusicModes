'use strict';

var
    FFT = require('./pitchfinder.js/fft'),
    PitchFinder = require('./pitchfinder.js/pitchfinder.js')(FFT),
    yinDetector = PitchFinder.YIN({threshold: 0.10}),

    configureDetector = function(conf){
        yinDetector = PitchFinder.YIN(conf);
    },
    detect = function(audioAnalyser){
        var
            buf = new Float32Array(2048),
            estimate;

        audioAnalyser.getFloatTimeDomainData(buf);
        estimate = yinDetector(buf);

        return estimate;
    };

module.exports = {
    configureDetector: configureDetector,
    detect: detect
};