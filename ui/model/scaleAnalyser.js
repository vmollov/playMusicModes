'use strict';

var
    analyserPrototype = {
        finalize: function(){
            this.completed = true;

            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }
            console.log('finalizing analyzer');
            if(this.onComplete){
                this.onComplete();
            }
        },
        resetCompletionTimer: function(seconds){
            //if no activity is detected on this analyser for this specified amount of time it will be finalized
            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }
            this.finalizeTimer = setTimeout(this.finalize, seconds * 1000);
        },
        addPlayedNote: function(note){
            var
                previousPlayedNote = this.played.notes.length
                    ? this.played.notes[this.played.notes.length - 1]
                    : null,

                checkMatch = function(arrNotes, scaleDirection){
                    var
                        i,
                        len = arrNotes.length;

                    for(i = this.matchIndexTracking[scaleDirection] + 1; i < len; i++){
                        if(note.nameBase === arrNotes[i].nameBase && (note.octave === arrNotes[i].octave + this.played.octaveOffset || this.played.octaveOffset === undefined)){
                            arrNotes[i].playedMatch = note;
                            this.matchIndexTracking[scaleDirection] = i;

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
            this.resetCompletionTimer(3);

            //determine whether to extend the scale by another octave
            if(previousPlayedNote && note.midiValue > previousPlayedNote.midiValue && this.matchIndexTracking.ascending === this.scale.ascending.length - 1 && this.matchingIndexTracking.descending === -1){
                this.scale.extend();
            }

            //todo: this logic needs improvement/optimization - checkMatch() should return scale completion status
            //determine whether to checkMatch for ascending or descending
            if(!previousPlayedNote || (this.matchIndexTracking.ascending < this.scale.ascending.length - 1)){
                return checkMatch(this.scale.ascending, "ascending");
            }
            if(this.matchIndexTracking.ascending === this.scale.ascending.length -1 && this.matchIndexTracking.descending < this.scale.descending.length - 1){
                var match = checkMatch(this.scale.descending, "descending");

                //terminate if end of scale is reached
                console.log('setting final timeout', this.matchIndexTracking.descending === this.scale.descending.length - 1);
                if(this.matchIndexTracking.descending === this.scale.descending.length - 1){
                    console.log('setting');
                    setTimeout(this.finalize);
                }

                return match;
            }
        }
    },

    getAnalyserForScale = function(scale, onCompleteHandler){
        var analyser = Object.create(analyserPrototype);

        analyser.scale = scale;                     //the scale to analyze
        analyser.onComplete = onCompleteHandler;    //done callback
        analyser.played = {                         //what was played
            octaveOffset: undefined,
            notes: []
        };
        analyser.matchIndexTracking = {             //analysis tracking
            ascending: -1,
            descending: -1
        };
        analyser.completed = false;                 //analysis completion flag
        analyser.finalizeTimer = undefined;         //finalization trigger timer - upon no notes received

        return analyser;
    };

module.exports = {
    getAnalyserForScale: getAnalyserForScale
};