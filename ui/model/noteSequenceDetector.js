'use strict';

var
    pitchDetector = require('./pitchDetector'),
    noteUtil = require('./noteUtil'),
    audioAnalyser,
    detectedPitches,
    timeoutId,
    onNoteDetectFn,
    isNoteInProgress = false,
    timeoutFn,
    clearTimeoutFn,

    updatePitch = function(){
        var
            estimate = pitchDetector.detect(audioAnalyser),
            detectedNote;

        if(!estimate.foundPitch ||  estimate.freq > 16000){
            if(isNoteInProgress && onNoteDetectFn){ //note was in progress but now it's done, so use the onNoteDetectFn and pass it in
                onNoteDetectFn(detectedPitches[detectedPitches.length - 1]);
            }

            isNoteInProgress = false;
        }
        else{ //interesting pitch detected
            detectedNote = noteUtil.noteFromFrequency(estimate.freq);

            if (!detectedPitches.length || (detectedNote.midiValue !== detectedPitches[detectedPitches.length - 1].midiValue && !isNoteInProgress)) {
                //new pitch detected - add it to the collection
                detectedNote.centsOffTimeProgression = [];
                detectedPitches.push(detectedNote);
                isNoteInProgress = true;
            }

            //add the newly detected centsOff to the pitch
            detectedPitches[detectedPitches.length - 1].centsOffTimeProgression.push(detectedNote.centsOff);
        }

        timeoutId = timeoutFn(updatePitch);
    },
    reset = function(){
        detectedPitches = [];
        timeoutId = undefined;
        onNoteDetectFn = undefined;
    };

module.exports = {
    startListening: function(analyser, onNoteDetect, customTimeoutFn){
        if(!analyser) throw Error('AudioAnalyser is required');

        reset();

        audioAnalyser = analyser;
        onNoteDetectFn = onNoteDetect;

        //for compatibility with some frameworks like AngularJS - so we can take advantage of real time updating, etc.
        timeoutFn = customTimeoutFn || setTimeout;
        clearTimeoutFn = customTimeoutFn.cancel || clearTimeout;
        if(customTimeoutFn && !customTimeoutFn.cancel) throw Error('If you pass a customTimeoutFn it needs to have a cancel() method defined');

        updatePitch();
    },
    stopListening: function(){
        if(timeoutId) {
            clearTimeoutFn(timeoutId);
            console.log('cleared timeout');
        }
        return detectedPitches;
    },
    getCurrentDetectedPitches: function(){
        return detectedPitches;
    },
    discardNotesExceptLastN: function(number){
        var i = detectedPitches.length - number;
        if(i !== i) throw Error('Number needs to be numeric');

        while(i-- > 0){
            detectedPitches.shift();
        }
    }
};