'use strict';

var
    scaleDirection = require('./scale').scaleDirection,

    analyser = {
        finalize: function(){
            this.completed = true;

            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }

            if(this.onComplete){
                this.onComplete();
            }
        },
        resetCompletionTimer: function(seconds){
            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }
            this.finalizeTimer = setTimeout(this.finalize, seconds * 1000);
        },
        addPlayedNote: function(note){
            var
                previousPlayedNoteNumber = this.played.notes.length
                    ? this.played.notes[this.played.notes.length - 1].midiValue
                    : Infinity,

                matchNoteToScale = function(scaleDirection){
                    var
                        i,
                        arrNotes = this.scale[scaleDirection],
                        len = arrNotes.length;

                    for(i = this.matchTracking.indexes[scaleDirection] + 1; i < len; i++){
                        if(note.nameBase === arrNotes[i].nameBase && (note.octave === arrNotes[i].octave + this.played.octaveOffset || this.played.octaveOffset === undefined)){
                            arrNotes[i].playedMatch = note;
                            this.matchTracking.indexes[scaleDirection] = i;

                            if(this.played.octaveOffset === undefined){ //set the octave offset on first match
                                this.played.octaveOffset = note.octave - arrNotes[i].octave;
                            }

                            return true;
                        }
                    }

                    return false;
                }.bind(this);

            if(this.completed){
                console.error('scaleAnalyser was set to completed and cannot process any more note additions');
                return;
            }

            this.played.notes.push(note);
            this.resetCompletionTimer(this.options.timeoutSeconds);

            //determine whether to extend the scale by another octave
            if(note.midiValue > previousPlayedNoteNumber && this.matchTracking.ascendingComplete && !this.matchTracking.descendingStarted){
                this.scale.extend();
            }

            //determine whether to matchNoteToScale for ascending or descending
            if(this.check.ascending && !this.matchTracking.ascendingComplete){
                return matchNoteToScale("ascending");
            }
            if(this.check.descending && !this.matchTracking.descendingComplete){
                var match = matchNoteToScale("descending");

                //terminate if end of scale is reached
                if(this.matchTracking.descendingComplete){
                    setTimeout(this.finalize);
                }

                return match;
            }
        }
    },

    getAnalyserForScale = function(scale, conf, onCompleteHandler){
        var newAnalyser = Object.create(analyser);

        newAnalyser.scale = scale;                     //the scale to analyze
        newAnalyser.completed = false;                 //analysis completion flag
        newAnalyser.finalizeTimer = undefined;         //finalization trigger timer - upon no notes received for a specified amount of time
        newAnalyser.onComplete = onCompleteHandler;    //done callback
        newAnalyser.options = conf;                    //configuration options
        newAnalyser.played = {                         //what was played
            octaveOffset: undefined,
            notes: [],
            get repeatedTopNote(){
                //tracks whether the top note was played twice when both ascending and descending are analyzed
                return newAnalyser.check.ascending
                    && newAnalyser.check.descending
                    && newAnalyser.matchTracking.ascendingComplete
                    && newAnalyser.matchTracking.descendingStarted
                    && !newAnalyser.scale.descending[0].playedMatch;
            }
        };

        //set options defaults
        newAnalyser.options.timeoutSeconds = conf.timeoutSeconds || 3;
        newAnalyser.check = {
            get ascending(){
                return conf.direction === scaleDirection.ASCENDING || conf.direction === scaleDirection.BOTH;
            },
            get descending(){
                return conf.direction === scaleDirection.DESCENDING || conf.direction === scaleDirection.BOTH;
            }
        };

        //analysis tracking
        newAnalyser.matchTracking = {
            indexes: {
                ascending: -1,
                descending: -1
            },
            get ascendingComplete(){
                return this.indexes.ascending === newAnalyser.scale.ascending.length - 1;
            },
            get descendingComplete(){
                return this.indexes.descending === newAnalyser.scale.descending.length - 1;
            },
            get ascendingStarted(){
                return this.indexes.ascending > -1;
            },
            get descendingStarted(){
                return this.indexes.descending > -1;
            }
        };

        return newAnalyser;
    };

module.exports = {
    getAnalyserForScale: getAnalyserForScale
};