'use strict';

var
    pitchDetector = require('./pitchDetector'),
    note = require('./note'),
    audioAnalyser,
    detectedPitches,
    timeoutId,
    onNoteDetectFn,
    isNoteInProgress = false,

    updatePitch = function(){
        var
            estimate = pitchDetector.detect(audioAnalyser),
            detectedNote;

        if(estimate.foundPitch &&  estimate.freq < 15000){
            detectedNote = note.noteFromFrequency(estimate.freq);

            if (!detectedPitches.length || detectedNote.midiValue !== detectedPitches[detectedPitches.length - 1].midiValue || !isNoteInProgress) {
                //new pitch detected - add it to the collection
                detectedNote.centsOffTimeProgression = [];
                detectedPitches.push(detectedNote);
                isNoteInProgress = true;

                onNoteDetectFn(detectedNote);
            }

            //add the newly detected centsOff to the pitch
            detectedPitches[detectedPitches.length - 1].centsOffTimeProgression.push(detectedNote.centsOff);
        }
        else{
            isNoteInProgress = false;
        }

        timeoutId = setTimeout(updatePitch);
    },
    reset = function(){
        detectedPitches = [];
        timeoutId = undefined;
        onNoteDetectFn = undefined;
    },
    startListening = function(analyser, onNoteDetect){
        if(!analyser) throw Error('AudioAnalyser is required');

        reset();

        audioAnalyser = analyser;
        onNoteDetectFn = onNoteDetect;

        updatePitch();
    },
    stopListening = function(){
        if(timeoutId) {
            clearTimeout(timeoutId);
        }
        return detectedPitches;
    },
    getCurrentDetectedPitches = function(){
        return detectedPitches;
    },
    discardNotesExceptLastN = function(number){
        var i = detectedPitches.length - number;
        if(i !== i) throw Error('Number needs to be numeric');

        while(i-- > 0){
            detectedPitches.shift();
        }
    };

module.exports = {
    startListening: startListening,
    stopListening: stopListening,
    getCurrentDetectedPitches: getCurrentDetectedPitches,
    discardNotesExceptLastN: discardNotesExceptLastN
};