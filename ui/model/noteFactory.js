'use strict';

var
    enharmonics = require('./data/enharmonics'),
    transposer = require('./transposer'),
    baseNoteValues = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11
    },
    baseNoteToIntMap = {
        0: "C",
        1: "D",
        2: "E",
        3: "F",
        4: "G",
        5: "A",
        6: "B"
    },

    note = {
        get name(){
            var transposed = transposer.transpose(this);
            return transposed.letter + (transposed.accidental === 'n' ? '' : transposed.accidental) + transposed.octave;
        },
        get nameWithAccidental(){
            var transposed = transposer.transpose(this);
            return transposed.letter + transposed.accidental + transposed.octave;
        },
        get nameBase(){
            var transposed = transposer.transpose(this);
            return transposed.letter + (transposed.accidental === 'n' ? '' : transposed.accidental);
        },
        buildInterval: function(semitones, steps){
            if(this.midiValue + semitones < 1 || this.midiValue + semitones > 130)
                throw Error("Cannot create note from: Invalid range: " + this.name + ", semitones: " + semitones + ", steps: " + steps);

            var
                targetNoteBaseSteps = (Number(getBaseNoteNumberForNoteName(this.letter)) + steps) % 7,
                targetNoteBaseValue = targetNoteBaseSteps < 0
                    ? targetNoteBaseSteps + 7
                    : targetNoteBaseSteps,
                targetEnharmonic = enharmonics.getEnharmonic(this.midiValue + semitones, baseNoteToIntMap[targetNoteBaseValue]),
                targetOctave = targetEnharmonic
                    ? this.octave + Number(targetEnharmonic.octaveOffset)
                    : undefined,
                targetNoteNumber = (this.midiValue % 12) + semitones;

            if(!targetEnharmonic || !targetOctave)
                throw Error("Cannot create note from " + this.name + ", semitones: " + semitones + ", steps: " + steps);

            while(targetNoteNumber >= 12){
                targetOctave++;
                targetNoteNumber -= 12;
            }
            while(targetNoteNumber < 0){
                targetOctave--;
                targetNoteNumber += 12;
            }

            return noteFromNameString(targetEnharmonic.note + targetOctave);
        },
        changeToEnharmonic: function(noteLetter){
            var enharmonic = enharmonics.getEnharmonic(this.midiValue, noteLetter);

            if(!enharmonic) throw Error('No enharmonic of ' + noteLetter + ' exists for ' + this.name);

            this.letter = noteLetter;
            this.accidental = enharmonic.note.length === 2
                ? enharmonic.note.substr(1, 1)
                : 'n';
            this.octave = this.octave + enharmonic.octaveOffset;

            return this;
        }
    },

    getBaseNoteNumberForNoteName = function(noteName){
        var
            keys = Object.keys(baseNoteToIntMap),
            i = keys.length;

        while(i--){
            if(baseNoteToIntMap[keys[i]] === noteName){
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
            letter = noteString.substr(0, 1).toUpperCase(),
            accidental = noteString.substr(1, 1).toLowerCase(),
            octave, noteValue, midiValue,
            newNote = Object.create(note);

        if(accidental === "s" || accidental === "f" || accidental === "x" || accidental === "d" || accidental === "n"){
            octave = noteString.substr(2, 1);
        }
        else{
            octave = noteString.substr(1, 1);
            accidental = "n";
        }

        noteValue = baseNoteValues[letter];

        if(accidental === 's') noteValue++;
        if(accidental === 'x') noteValue = noteValue + 2;
        if(accidental === 'f') noteValue--;
        if(accidental === 'd') noteValue = noteValue - 2;

        midiValue = 12 + (octave * 12) + noteValue;

        newNote.letter = letter;
        newNote.accidental = accidental;
        newNote.octave = Number(octave);
        newNote.midiValue = midiValue;

        return newNote;
    },
    noteFromNumber = function(number){
        if(number < 1 || number > 132) throw Error('Cannot calculate note from number ' + number);

        var
            noteNumber = number % 12,
            octave = Math.floor(number / 12) - 1,
            noteString = enharmonics.getDefaultEnharmonic(noteNumber) + octave;

        return noteFromNameString(noteString);
    },
    noteFromFrequency = function( frequency ) {
        var
            number = frequency
                ? Math.round(69 + 12 * Math.log(frequency / 440) / Math.LN2)
                : 0,
            note = noteFromNumber(number);

        //if(!note) throw Error('Cannot calculate note from frequency' + frequency);

        note.centsOff = Math.floor(1200 * Math.log( frequency / frequencyForNoteNumber(number)) / Math.log(2));

        return note;
    };

module.exports = window.note = {
    noteFromFrequency: noteFromFrequency,
    noteFromNumber: noteFromNumber,
    noteFromNameString: noteFromNameString
};