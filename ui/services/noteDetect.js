'use strict';

module.exports = function(app){

    require('./audioInput')(app);

    app.factory('noteDetect', ['audioInput',
        function(audioInput){
            var
                noteSequenceDetector = require('../model/noteSequenceDetector'),
                scale = require('../model/scale'),
                CMajorScale = scale.createScale('Major', 'C4'),
                playedScaleAnalyser = require('../model/scaleAnalyser'),
                scaleAnalyser = playedScaleAnalyser.getAnalyserForScale(CMajorScale, scale.scaleDirection.BOTH,
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

            window.sa = scaleAnalyser;
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