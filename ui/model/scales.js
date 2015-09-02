'use strict';

var
    musicModesData = require('./MusicModesData.json'),
    noteUtil = require('./noteUtil'),

    createScale = function(modeName, startingNoteStr){
        if(!musicModesData.ModeDefinitions[modeName]) throw Error("Mode not found: " + modeName);

        var
            mode = musicModesData.ModeDefinitions[modeName],
            startingNoteObj = noteUtil.noteFromNameString(startingNoteStr),
            pattern = mode.pattern || musicModesData.ModeDefinitions[mode.patternOf].pattern,
            patternDesc = mode.patternDesc || JSON.parse(JSON.stringify(pattern)).reverse().map(function(val){ return -val; }),
            stepPattern = mode.stepPattern || null,
            stepPatternDesc = mode.stepPatternDesc || null,
            scaleAsc,
            scaleDesc,

            buildScale = function(startingNote, arrPattern, arrStepPattern, stepPatternSubstitute){
                var
                    outputScale = [],
                    currentNote = startingNote,
                    i,
                    len = arrPattern.length;

                for(i = 0; i < len; i++){
                    outputScale.push(currentNote);
                    currentNote = noteUtil.noteFromInterval(currentNote, arrPattern[i], arrStepPattern ? arrStepPattern[i] : stepPatternSubstitute);
                }
                outputScale.push(currentNote);

                return outputScale;
            };

        scaleAsc = buildScale(startingNoteObj, pattern, stepPattern, 1);
        scaleDesc = buildScale(scaleAsc[scaleAsc.length - 1], patternDesc, stepPatternDesc, -1);

        return {
            ascending: scaleAsc,
            descending: scaleDesc
        };
    };

//todo: remove
window.createScale = createScale;
window.noteFromInterval = noteUtil.noteFromInterval;
window.noteFromNameString = noteUtil.noteFromNameString;
