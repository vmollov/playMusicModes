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
        transpose: function(note){
            if(transposition.semitones === 0 && transposition.steps === 0){
                return this.removeTransposition(note);
            }

            var transposedNote = note.buildInterval(transposition.semitones, transposition.steps);

            note.transposition = {
                semitones: transposition.semitones,
                steps: transposition.steps,
                letter: transposedNote.letter,
                accidental: transposedNote.accidental,
                octave: transposedNote.octave
            };

            return note;
        },
        removeTransposition: function(note){
            delete note.transposition;

            return note;
        }
    };

module.exports = {
    getTransposer: function(){
        if(!transposerSingleton){
            transposerSingleton = transposer;
        }

        return transposerSingleton;
    },
    standardTranspositions: require('./standardTranspositionsData.json')
};