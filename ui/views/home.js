'use strict';

module.exports = function(app){

    require('../services/noteSequenceDetect')(app);
    require('../model/scales');

    app.controller('homeCtrl', ['$scope', 'noteSequenceDetect',
        function($scope, noteSequenceDetect){
            var pitchDetectionWatch, scaleAnalyserWatch;

            $scope.start = function(){
                noteSequenceDetect.startPitchDetection();

                if(pitchDetectionWatch) return;

                pitchDetectionWatch = $scope.$watch(
                    function() {
                        return noteSequenceDetect.getDetectedPitches();
                    },
                    function(newValue){
                        $scope.detectedPitches = newValue;
                    }
                );

                if(scaleAnalyserWatch) return;

                scaleAnalyserWatch = $scope.$watch(
                    function(){
                        return noteSequenceDetect.getCMajorScale();
                    },
                    function(newValue){
                        console.log('watch called');
                        $scope.CMajorScale = newValue;
                    }
                );

            };
            $scope.stop = function(){
                noteSequenceDetect.stopPitchDetection();
                if(pitchDetectionWatch) {
                    pitchDetectionWatch();
                    pitchDetectionWatch = undefined;
                }
            };
        }
    ]);
};