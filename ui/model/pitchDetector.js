'use strict';

var
    FFT = require('./pitchfinder.js/fft'),
    PitchFinder = require('./pitchfinder.js/pitchfinder.js')(FFT),
    YINDetector = PitchFinder.YIN({threshold: 0.10});

module.exports = {
    configureDetector: function(conf){
        YINDetector = PitchFinder.YIN(conf);
    },
    detect: function(analyser){
        var
            buf = new Float32Array(2048),
            estimate;

        analyser.getFloatTimeDomainData(buf);
        estimate = YINDetector(buf);

        return estimate;
    }
};