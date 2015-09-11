'use strict';

var
    analyserPrototype = {
        finalize: function(){
            this.completed = true;

            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }
            if(this.onComplete){
                this.onComplete();
            }
        },
        addPlayedNote: function(note){
            var
                previousPlayedNote = this.played.notes.length
                    ? this.played.notes[this.played.notes.length - 1]
                    : null,

                checkMatch = function(arrNotes, scaleDirection){
                    var
                        i,
                        len = arrNotes.length,
                        matchFound = false;

                    for(i = this.matchIndexTracking[scaleDirection] + 1; i < len; i++){
                        if(note.nameBase === arrNotes[i].nameBase && (note.octave === arrNotes[i].octave + this.played.octaveOffset || this.played.octaveOffset === undefined)){
                            matchFound = true;
                            arrNotes[i].playedMatch = note;
                            this.matchIndexTracking[scaleDirection] = i;

                            if(this.played.octaveOffset === undefined){ //set the octave offset on first match
                                this.played.octaveOffset = note.octave - arrNotes[i].octave;
                            }

                            break;
                        }
                    }

                    return matchFound;
                }.bind(this);

            if(this.completed){
                console.error('scaleAnalyser was set to completed and cannot process any more note additions');
                return;
            }

            this.played.notes.push(note);

            //determine whether to extend the scale by another octave
            if(previousPlayedNote && note.midiValue > previousPlayedNote.midiValue && this.matchIndexTracking.ascending === this.scale.ascending.length - 1){
                this.scale.extend();
            }

            //check ascending
            if(checkMatch(this.scale.ascending, "ascending")){//todo: improve this condition checking
                return;
            }
            //check descending
            if(checkMatch(this.scale.descending, "descending")){
                return;
            }

            //terminate if end of scale is reached
            if(this.matchIndexTracking.descending === this.scale.descending.length - 1){
                return this.finalize();
            }

            //reset the completion timer
            if(this.finalizeTimer) {
                clearTimeout(this.finalizeTimer);
            }
            this.finalizeTimer = setTimeout(this.finalize, 3 * 1000);
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