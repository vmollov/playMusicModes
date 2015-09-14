'use strict';

module.exports = function(app){

    require('../services/noteDetect')(app);

    app.controller('homeCtrl', ['$scope', 'noteDetect',
        function($scope, noteDetect){
            var pitchDetectionWatch, scaleAnalyserWatch;

            $scope.start = function(){
                noteDetect.startScaleDetection($scope);

                if(pitchDetectionWatch) return;

                pitchDetectionWatch = $scope.$watch(
                    function() {
                        return noteDetect.getDetectedPitches();
                    },
                    function(newValue){
                        $scope.detectedPitches = newValue;
                    }
                );

                if(scaleAnalyserWatch) return;

                scaleAnalyserWatch = $scope.$watch(
                    function(){
                        return noteDetect.getCMajorScale();
                    },
                    function(newValue){
                        $scope.CMajorScale = newValue;
                    }
                );

            };
            $scope.stop = function(){
                noteDetect.stopScaleDetection();
                if(pitchDetectionWatch) {
                    pitchDetectionWatch();
                    pitchDetectionWatch = undefined;
                }
            };
        }
    ]);
};