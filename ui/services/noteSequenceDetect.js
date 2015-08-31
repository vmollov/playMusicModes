'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteSequenceDetect', ['audioInput', '$timeout',
        function(audioInput, $timeout){
            var
                pitchDetector = require('../model/pitchDetector'),
                noteUtil = require('../model/noteUtil'),
                analyser,
                detectedPitches = [],
                detectedPitch,
                timeoutId,

                updatePitch = function(){
                    var estimate = pitchDetector.detect(analyser);

                    if(estimate.foundPitch &&  estimate.freq < 16000){
                        detectedPitch = noteUtil.noteFromFrequency(estimate.freq);

                        if(!detectedPitches.length || detectedPitch.number !== detectedPitches[detectedPitches.length - 1].number){
                            //new pitch detected - add it to the collection
                            detectedPitches.push({
                                number: detectedPitch.number,
                                letter: detectedPitch.letter,
                                octave: detectedPitch.octave,
                                centsOffTimeProgression: []
                            });
                        }

                        //add the newly detected centsOff to the pitch
                        detectedPitches[detectedPitches.length - 1].centsOffTimeProgression.push(detectedPitch.centsOff);
                    }

                    timeoutId = $timeout(updatePitch);
                };

            return {
                startPitchDetection: function(){
                    audioInput.getAnalyser().then(
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
                        console.log(detectedPitches);
                    }
                },
                getDetectedPitches: function(){
                    return detectedPitches;
                }
            };
        }
    ]);
};