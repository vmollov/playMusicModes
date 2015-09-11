'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteSequenceDetect', ['audioInput',
        function(audioInput){
            var
                noteSequenceDetector = require('../model/noteSequenceDetector'),
                scales = require('../model/scales'),
                CMajorScale = scales.createScale('Major', 'C4'),
                playedScaleAnalyser = require('../model/scaleAnalyser'),
                scaleAnalyser = playedScaleAnalyser.getAnalyserForScale(CMajorScale,
                    function(){
                        console.log('done analyzing scale');
                    }
                ),
                callerScope,

                noteDetected = function(note){
                    scaleAnalyser.addPlayedNote(note);
                    if(callerScope){
                        callerScope.$digest();
                    }
                };

            return {
                startScaleDetection: function(scopeObj){ //caller scope
                    callerScope = scopeObj;

                    audioInput.getAnalyser().then(
                        function(objAnalyser){
                            noteSequenceDetector.startListening(objAnalyser, noteDetected);
                        }
                    );
                },
                stopScaleDetection: function(){
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