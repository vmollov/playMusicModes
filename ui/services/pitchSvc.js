'use strict';

module.exports = function(app){

    require('./audioSvc')(app);

    app.factory('pitchSvc', ['audioSvc', '$timeout',
        function(audioSvc, $timeout){
            var
                pitchDetector = require('../model/pitchDetector'),
                noteUtil = require('../model/noteUtil'),
                analyser,
                detectedPitches = [],
                detectedPitch,
                timeoutId,

                updatePitch = function(){
                    var estimate = pitchDetector.detect(analyser);

                    if(estimate.foundPitch &&  estimate.freq < 1500){
                        /*detectedPitches.push(noteUtil.noteFromFrequency(estimate.freq));
                        console.log(detectedPitches[detectedPitches.length -1]);*/
                        detectedPitch = noteUtil.noteFromFrequency(estimate.freq);
                        console.log(detectedPitch);
                    }

                    timeoutId = $timeout(updatePitch);
                };

            return {
                startPitchDetection: function(){
                    audioSvc.getAnalyser().then(
                        function(objAnalyser){
                            analyser = objAnalyser;
                            updatePitch();
                        }
                    );
                },
                stopPitchDetection: function(){
                    if(timeoutId) {
                        $timeout.cancel(timeoutId);
                        timeoutId = undefined;
                    }
                },
                getDetectedPitch: function(){
                    return detectedPitch;
                }
            };
        }
    ]);
};