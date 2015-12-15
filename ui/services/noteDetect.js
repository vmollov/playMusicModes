'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteDetect', ['audioInput',
        function(audioInput){
            var
                noteSequenceDetector = require('../model/noteSequenceDetector'),
                scale = require('../model/scaleFactory'),
                scaleDirection = require('../model/constants').scaleDirection,
                CMajorScale = scale.createScale('Major', 'C4'),
                playedScaleAnalyser = require('../model/scaleAnalyserFactory'),
                scaleAnalyser = playedScaleAnalyser.getAnalyserForScale(CMajorScale, {direction: scaleDirection.BOTH},
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
                //todo: this is a stub method
                getCMajorScale: function(){
                    return CMajorScale;
                }
            };
        }
    ]);
};