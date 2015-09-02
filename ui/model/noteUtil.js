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
        return noteString.match(/^[A-Ga-g][sfxdn]?[0-9]$/) !== null;
    },
    frequencyForNoteNumber = function(noteNumber) {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    },
    noteFromNameString = function(noteString){
        if(!isNoteStringValid(noteString)) throw Error("Invalid note string " + noteString);

        var
            name = noteString.substr(0, 1).toUpperCase(),
            accidental = noteString.substr(1, 1).toLowerCase(),
            octave, noteValue, midiValue;

        if(accidental === "s" || accidental === "f" || accidental === "x" || accidental === "d" || accidental === "n"){
            octave = noteString.substr(2, 1);
        }
        else{
            octave = noteString.substr(1, 1);
            accidental = "n";
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
            fullName: name + (accidental === 'n' ? '' : accidental) + octave,
            fullNameWithAccidental: name + accidental + octave
        };
    },
    noteFromNumber = function(number){
        if(number < 1 || number > 132){
            throw Error('Cannot calculate note from number' + number);
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

        if(!note) throw Error('Cannot calculate note from frequency' + frequency);

        note.centsOff = Math.floor(1200 * Math.log( frequency / frequencyForNoteNumber(number)) / Math.log(2));

        return note;
    },
    noteFromInterval = function(startingNote, semitones, steps){
        var startingNoteObj = (typeof startingNote === "string")
            ? noteFromNameString(startingNote)
            : startingNote;

        if(startingNoteObj.midiValue + semitones < 1 || startingNoteObj.midiValue + semitones > 130)
            throw Error("Cannot create note from: Invalid range: " + startingNoteObj.fullName + ", semitones: " + semitones + ", steps: " + steps);

        var
            startingNoteObjIndex = startingNoteObj.midiValue % 12,
            targetNoteIndex = (startingNoteObj.midiValue + semitones) % 12,
            targetNoteBaseSteps = (Number(getBaseValueForNoteName(startingNoteObj.name)) + steps) % 7,
            targetNoteBaseValue = targetNoteBaseSteps < 0
                ? targetNoteBaseSteps + 7
                : targetNoteBaseSteps,
            enharmonicsSet = enharmonics[targetNoteIndex],
            enharmonicObject = enharmonicsSet[enharmonics.baseNoteToIntMap[targetNoteBaseValue]],
            targetOctave = enharmonicObject
                ? Number(startingNoteObj.octave) + Number(enharmonicObject.octaveOffset)
                : undefined,
            targetNoteNumber = startingNoteObjIndex + semitones;

        if(!enharmonicObject || !targetOctave)
            throw Error("Cannot create note from " + startingNoteObj.fullName + ", semitones: " + semitones + ", steps: " + steps);

        while(targetNoteNumber >= 12){
            targetOctave++;
            targetNoteNumber -= 12;
        }
        while(targetNoteNumber < 0){
            targetOctave--;
            targetNoteNumber += 12;
        }

        return noteFromNameString(enharmonicObject.note + targetOctave);
    };

module.exports = {
    noteFromFrequency: noteFromFrequency,
    frequencyForNoteNumber: frequencyForNoteNumber,
    noteFromNumber: noteFromNumber,
    noteFromNameString: noteFromNameString,
    noteFromInterval: noteFromInterval
};