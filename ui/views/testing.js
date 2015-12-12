'use strict';

module.exports = function(app){

    require('../services/noteDetect')(app);

    app.controller('testingCtrl', ['$scope', 'noteDetect', 'Scale',
        function($scope, noteDetect, Scale){
            var pitchDetectionWatch, scaleAnalyserWatch;

            console.log('POC: Scale Angular factory from model', Scale);

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