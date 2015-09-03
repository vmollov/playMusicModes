'use strict';

var
    analyserPrototype = {
        addPlayedNote: function(note){
            this.played.notes.push(note);

            return note;
        }
    };

module.exports = {
    getAnalyserForScale: function(scale){
        var analyser = Object.create(analyserPrototype);

        analyser.scale = scale;
        analyser.played = {
            notes: [],
            startingOctave: 0
        };

        return analyser;
    }
};