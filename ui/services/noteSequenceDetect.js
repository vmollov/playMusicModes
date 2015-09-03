'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteSequenceDetect', ['audioInput', '$timeout',
        function(audioInput, $timeout){
            var
                pitchDetector = require('../model/pitchDetector'),
                noteUtil = require('../model/noteUtil'),
                audioAnalyser,
                detectedPitches = [],
                detectedPitch,
                timeoutId,
                scales = require('../model/scales'),
                playedScaleAnalyser = require('../model/scaleAnalyser'),
                scaleAnalyser = playedScaleAnalyser.getAnalyserForScale(scales.createScale('Major', 'C4')),

                updatePitch = function(){
                    var
                        estimate = pitchDetector.detect(audioAnalyser),
                        isNoteContinuing = false;

                    if(estimate.foundPitch &&  estimate.freq < 16000){
                        detectedPitch = noteUtil.noteFromFrequency(estimate.freq);

                        if (!detectedPitches.length
                            || (detectedPitch.midiValue !== detectedPitches[detectedPitches.length - 1].midiValue && !isNoteContinuing)) {

                            //new pitch detected - add it to the collection
                            detectedPitch.centsOffTimeProgression = [];
                            detectedPitches.push(detectedPitch);
                            isNoteContinuing = true;
                            scaleAnalyser.addPlayedNote(detectedPitch);
                        }

                        //add the newly detected centsOff to the pitch
                        detectedPitches[detectedPitches.length - 1].centsOffTimeProgression.push(detectedPitch.centsOff);
                    }
                    else{
                        isNoteContinuing = false;
                    }

                    timeoutId = $timeout(updatePitch);
                };

            return {
                startPitchDetection: function(){
                    audioInput.getAnalyser().then(
                        function(objAnalyser){
                            audioAnalyser = objAnalyser;
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