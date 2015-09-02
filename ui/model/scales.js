'use strict';

var
    musicModesData = require('./MusicModesData.json'),
    noteUtil = require('./noteUtil'),

    scalePrototype = {
        extend: function(octaves){
            var
                len = octaves || 1,
                i,
                nextOctaveStartingNote,
                scaleInNextOctave,
                outputScale = JSON.parse(JSON.stringify(this));

            for(i = 0; i < len; i++){
                nextOctaveStartingNote = outputScale.ascending.pop();
                scaleInNextOctave = createScale(outputScale.modeName, nextOctaveStartingNote);
                outputScale.ascending = outputScale.ascending.concat(scaleInNextOctave.ascending);
                scaleInNextOctave.descending.pop(); //remove the last note since it is already present
                outputScale.descending = scaleInNextOctave.descending.concat(outputScale.descending);
            }

            return outputScale;
        }
    },

    createScale = function(modeName, startingNote){
        if(!musicModesData.ModeDefinitions[modeName]) throw Error("Mode not found: " + modeName);

        var
            mode = musicModesData.ModeDefinitions[modeName],
            startingNoteObj = (typeof startingNote === "string")
                ? noteUtil.noteFromNameString(startingNote)
                : startingNote,
            pattern = mode.pattern || musicModesData.ModeDefinitions[mode.patternOf].pattern,
            patternDesc = mode.patternDesc || JSON.parse(JSON.stringify(pattern)).reverse().map(function(val){ return -val; }),
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
