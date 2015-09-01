'use strict';

var
    musicModesData = require('./MusicModesData.json'),
    noteUtil = require('./noteUtil'),

    createScale = function(modeName, startingNote){
        if(!musicModesData.ModeDefinitions[modeName]){
            console.error('Mode not found: ', modeName);
            return;
        }

        var
            mode = musicModesData.ModeDefinitions[modeName],
            currentNote = noteUtil.noteFromNameString(startingNote),
            pattern = mode.pattern || musicModesData.ModeDefinitions[mode.patternOf].pattern,
            patternDesc = mode.patternDesc, // || pattern.reverse().map(function(val){ return -val; }),
            stepPattern = mode.stepPattern || null,
            stepPatternDesc = mode.stepPatternDesc || null,
            patternLen = pattern.length, i, scaleAsc = [], scaleDesc = [];

        //compose the ascending version
        for(i = 0; i < patternLen; i++){
            scaleAsc.push(currentNote);
            currentNote = noteUtil.noteFromInterval(currentNote, pattern[i], stepPattern ? stepPattern[i] : 1);
        }
        scaleAsc.push(currentNote);


        return scaleAsc;
    };

window.createScale = createScale;
