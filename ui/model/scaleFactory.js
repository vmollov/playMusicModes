'use strict';

var
    musicModesData = require('./MusicModesData.json'),
    noteFactory = require('./noteFactory'),

    scalePrototype = {
        extend: function(octaves){
            var
                len = octaves || 1,
                i,
                nextOctaveStartingNote,
                scaleInNextOctave;

            for(i = 0; i < len; i++){
                nextOctaveStartingNote = this.ascending.pop();
                scaleInNextOctave = createScale(this.modeName, nextOctaveStartingNote);
                this.ascending = this.ascending.concat(scaleInNextOctave.ascending);
                scaleInNextOctave.descending.pop(); //remove the last note since it is already present
                this.descending = scaleInNextOctave.descending.concat(this.descending);
            }

            return this;
        }
    },

    createScale = function(modeName, startingNote){
        if(!musicModesData.ModeDefinitions[modeName]) throw Error("Mode not found: " + modeName);

        var
            mode = musicModesData.ModeDefinitions[modeName],
            startingNoteObj = (typeof startingNote === "string")
                ? noteFactory.noteFromNameString(startingNote)
                : startingNote,
            pattern = mode.pattern || musicModesData.ModeDefinitions[mode.patternOf].pattern,
            patternDesc = mode.patternDesc || pattern.slice().reverse().map(function(val){ return -val; }),
            stepPattern = mode.stepPattern || null,
            stepPatternDesc = mode.stepPatternDesc || null,
            scaleAsc,
            scaleDesc,
            outputScale,

            buildScale = function(fromNote, arrPattern, arrStepPattern, stepPatternSubstitute){
                var
                    outputScale = [],
                    currentNote = fromNote,
                    i,
                    len = arrPattern.length;

                for(i = 0; i < len; i++){
                    outputScale.push(currentNote);
                    currentNote = currentNote.buildInterval(arrPattern[i], arrStepPattern ? arrStepPattern[i] : stepPatternSubstitute);
                }
                outputScale.push(currentNote);

                return outputScale;
            };

        scaleAsc = buildScale(startingNoteObj, pattern, stepPattern, 1);
        scaleDesc = buildScale(scaleAsc[scaleAsc.length - 1], patternDesc, stepPatternDesc, -1);

        outputScale = Object.create(scalePrototype);
        outputScale.ascending = scaleAsc;
        outputScale.descending = scaleDesc;
        outputScale.modeName = modeName;

        return outputScale;
    };

module.exports = {
    createScale: createScale
};
