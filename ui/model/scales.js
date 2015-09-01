'use strict';

var
    musicModesData = require('./MusicModesData.json'),
    noteUtil = require('./noteUtil'),

    createScale = function(modeName, startingMIDINote){
        if(!musicModesData.ModeDefinitions[modeName]){
            console.error('Mode not found: ', modeName);
            return;
        }

        var
            mode = musicModesData.ModeDefinitions[modeName],
            pattern = mode.pattern || musicModesData.ModeDefinitions[mode.patternOf].pattern,
            patternDesc = mode.patternDesc || pattern.reverse().map(function(val){ return -val; }),
            stepPattern = mode.stepPattern || null,
            stepPatternDesc = mode.stepPatternDesc || null;




        return patternDesc;
    };

