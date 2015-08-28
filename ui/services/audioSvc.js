'use strict';

module.exports = function(app){

    app.factory('audioSvc', ['$q',
        function($q){
            var
                streamDeferred,

                getStream = function(){
                    streamDeferred = $q.defer();

                    navigator.getUserMedia({
                        "audio": {
                            "mandatory": {
                                "googEchoCancellation": "false",
                                "googAutoGainControl": "false",
                                "googNoiseSuppression": "false",
                                "googHighpassFilter": "false"
                            },
                            "optional": []
                        }
                    },
                    function(stream){

                        streamDeferred.resolve(stream);
                    },
                    function(err){
                        console.error("Couldn't get an audio stream", err);

                        //todo: implement logic to allow subsequent requests for mike use
                        streamDeferred.reject(err);
                    });

                    return streamDeferred.promise;
                };

            return {
                getAnalyser: function(){
                    console.log(streamDeferred);
                    var streamPromise =
                        (streamDeferred && streamDeferred.promise.$$state.status === 1 && streamDeferred.promise) || getStream();

                    return streamPromise.then(
                        function(stream){
                            var
                                audioContext = new AudioContext(),
                                mediaStreamSource = audioContext.createMediaStreamSource(stream),
                                analyser = audioContext.createAnalyser();

                            mediaStreamSource.connect(analyser);

                            return analyser;
                        }
                    );
                }
            };
        }
    ]);
};