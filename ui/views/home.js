'use strict';

module.exports = function(app){

    require('../services/pitchSvc')(app);

    app.controller('homeCtrl', ['$scope', 'pitchSvc',
        function($scope, pitchSvc){
            var pitchDetectionWatch;

            $scope.start = function(){
                pitchSvc.startPitchDetection();

                if(pitchDetectionWatch) return;

                pitchDetectionWatch = $scope.$watch(function() {
                    return pitchSvc.getDetectedPitch();
                }, function(newValue, oldValue){
                    $scope.detectedPitch = newValue;
                });

            };
            $scope.stop = function(){
                pitchSvc.stopPitchDetection();
                if(pitchDetectionWatch) {
                    pitchDetectionWatch();
                    pitchDetectionWatch = undefined;
                }
            };
        }
    ]);
};