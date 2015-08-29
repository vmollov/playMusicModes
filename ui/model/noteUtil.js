'use strict';

var
    noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    frequencyForNote = function(noteNumber) {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    };

module.exports = {
    noteFromFrequency: function( frequency ) {
        var
            number = frequency
                ? Math.round(69 + 12 * Math.log(frequency / 440) / Math.LN2)
                : 0,
            letter = noteStrings[number % 12],
            octave = Math.floor(number / 12) - 1,
            centsOff = Math.floor(1200 * Math.log( frequency / frequencyForNote(number)) / Math.log(2));

        return {
            number: number,
            letter: letter,
            octave: octave,
            centsOff: centsOff
        };
    },
    frequencyForNote: frequencyForNote
};