'use strict';

var
    FFT = require('./pitchfinder.js/fft'),
    PitchFinder = require('./pitchfinder.js/pitchfinder.js')(FFT),
    yinDetector = PitchFinder.YIN({threshold: 0.10}),

    timeoutId;

module.exports = {
    configureDetector: function(conf){
        yinDetector = PitchFinder.YIN(conf);
    },
    detect: function(analyser){
        var
            buf = new Float32Array(2048),
            estimate;

        analyser.getFloatTimeDomainData(buf);
        estimate = yinDetector(buf);

        return estimate;
    },
    startListening: function(analyser, pitchDetectedHandler){


    }
};