'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteSequenceDetect', ['audioInput', '$timeout',
        function(audioInput, $timeout){
            var
                noteSequenceDetector = require('../model/noteSequenceDetector'),
                scales = require('../model/scales'),
                CMajorScale = scales.createScale('Major', 'C4'),
                playedScaleAnalyser = require('../model/scaleAnalyser'),
                scaleAnalyser = playedScaleAnalyser.getAnalyserForScale(CMajorScale),

                noteDetected = function(note){
                    scaleAnalyser.addPlayedNote(note);
                };

            return {
                startPitchDetection: function(){
                    audioInput.getAnalyser().then(
                        function(objAnalyser){
                            noteSequenceDetector.startListening(objAnalyser, noteDetected, $timeout);
                        }
                    );
                },
                stopPitchDetection: function(){
                    return noteSequenceDetector.stopListening();
                },
                getDetectedPitches: function(){
                    return noteSequenceDetector.getCurrentDetectedPitches();
                },
                getCMajorScale: function(){
                    return CMajorScale;
                }
            };
        }
    ]);
};