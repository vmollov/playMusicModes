'use strict';

var
    transposerSingleton,
    transposition = {
        semitones: 0,
        steps: 0
    },

    transposer = {
        setTransposition: function(objConf){
            transposition.semitones = objConf.semitones || 0;
            transposition.steps = objConf.steps || 0;
        },
        removeTransposition: function(){
            transposition.semitones = 0;
            transposition.steps = 0;
        },
        transpose: function(note){
            var transposedNote = note.buildInterval(transposition.semitones, transposition.steps);

            return {
                semitones: transposition.semitones,
                steps: transposition.steps,
                letter: transposedNote.letter,
                accidental: transposedNote.accidental,
                octave: transposedNote.octave
            };
        }
    };

module.exports = (function(){
    if(!transposerSingleton) transposerSingleton = transposer;

    return transposerSingleton;
})();