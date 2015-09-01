'use strict';

var
    enharmonics = require('./enharmonicsData.json'),

    getBaseValueForNoteName = function(noteName){
        var
            keys = Object.keys(enharmonics.baseNoteToIntMap),
            i = keys.length;

        while(i--){
            if(enharmonics.baseNoteToIntMap[keys[i]] === noteName){
                return keys[i];
            }
        }

        return null;
    },
    isNoteStringValid = function(noteString){
        return noteString.match(/^[A-G][sfxdn]?[0-9]$/) !== null;
    },
    frequencyForNoteNumber = function(noteNumber) {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    },
    noteFromNameString = function(noteString){
        if(!isNoteStringValid(noteString)){
            throw Error("Invalid note string", noteString);
        }

        var
            name = noteString.substr(0, 1).toUpperCase(),
            accidental = noteString.substr(1, 1).toLowerCase(),
            octave, noteValue, midiValue;

        if(accidental === "s" || accidental === "f" || accidental === "x" || accidental === "d" || accidental === "n"){
            octave = noteString.substr(2, 1);
        }
        else{
            octave = noteString.substr(1, 1);
            accidental = "";
        }

        noteValue = enharmonics.baseNoteValues[name];

        if(accidental === 's') noteValue++;
        if(accidental === 'x') noteValue = noteValue + 2;
        if(accidental === 'f') noteValue--;
        if(accidental === 'd') noteValue = noteValue - 2;

        midiValue = 12 + (octave * 12) + noteValue;

        return {
            name: name,
            accidental: accidental,
            octave: octave,
            midiValue: midiValue,
            stringName: name + accidental + octave
        };
    },
    noteFromNumber = function(number){
        if(number < 1 || number > 132){
            throw Error('Cannot calculate note from number', number);
        }

        var
            noteNumber = number % 12,
            octave = Math.floor(number / 12) - 1,
            noteString = enharmonics[noteNumber].default + octave;

        return noteFromNameString(noteString);
    },
    noteFromFrequency = function( frequency ) {
        var
            number = frequency
                ? Math.round(69 + 12 * Math.log(frequency / 440) / Math.LN2)
                : 0,
            note = noteFromNumber(number);

        if(!note){
            throw Error('Cannot calculate note from frequency', frequency);
        }

        note.centsOff = Math.floor(1200 * Math.log( frequency / frequencyForNoteNumber(number)) / Math.log(2));

        return note;
    },
    noteFromInterval = function(startingNoteStr, semitones, steps){
        var
            startingNote = noteFromNameString(startingNoteStr),
            targetNoteMidiValue = (startingNote.midiValue % 12) + semitones,
            targetNoteBaseValue = (getBaseValueForNoteName(startingNote.name) + steps) % 7,
            enharmonicsSet = enharmonics[targetNoteMidiValue],
            enharmonicObject = enharmonicsSet[enharmonics.baseNoteToIntMap[targetNoteBaseValue]],
            targetOctave = enharmonicObject
                ? Number(startingNote.octave) + Number(enharmonicObject.octaveOffset)
                : undefined;

        if(!enharmonicObject || !targetOctave){
            throw Error("Cannot calculate note from interval for", startingNoteStr, semitones, steps);
        }

        return noteFromNameString(enharmonicObject.note + targetOctave);

    };

window.noteFromNumber = noteFromNumber;
window.noteFromInterval = noteFromInterval;

module.exports = {
    noteFromFrequency: noteFromFrequency,
    frequencyForNoteNumber: frequencyForNoteNumber,
    noteFromNumber: noteFromNumber,
    noteFromNameString: noteFromNameString,
    noteFromInterval: noteFromInterval
};