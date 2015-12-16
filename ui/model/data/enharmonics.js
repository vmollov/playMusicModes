'use strict';

var
    data = require('./enharmonicsData.json'),

    getEnharmonicSetForNoteIndex = function (noteIndex) {
        return data[noteIndex];
    },
    getNoteBaseIndex = function (midiValue) {
        return midiValue % 12;
    };

module.exports = {
    getEnharmonic: function (midiValue, noteName) {
        var enharmonicsSet = getEnharmonicSetForNoteIndex(getNoteBaseIndex(midiValue));

        return enharmonicsSet[noteName];
    },
    getDefaultEnharmonic: function (midiValue) {
        return data[getNoteBaseIndex(midiValue)].default;
    }
};