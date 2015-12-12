'use strict';

var musicModesData = require('./MusicModesData.json');

module.exports = {
    getModeGroups: function(){
        return Object.keys(musicModesData.ModeGroups);
    },
    getModeDefinitions: function(){
        return musicModesData.ModeDefinitions;
    }
};