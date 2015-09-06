'use strict';

var
    analyserPrototype = {
        addPlayedNote: function(note){
            var
                i,
                len = this.scale.ascending.length;

            if(this.matchIndexAsc === undefined){
                this.matchIndexAsc = -1;
            }

            for(i = this.matchIndexAsc + 1; i < len; i++){
                if(note.nameBase === this.scale.ascending[i].nameBase){
                    //match found

                    console.log('match found', note.name); //todo: remove

                    this.scale.ascending[i].playedMatch = note; //todo: this does not trigger digest - make it into ng service
                    this.matchIndexAsc = i;
                    break;
                }
            }

            this.played.notes.push(note);

            return note;
        }
    };

module.exports = {
    getAnalyserForScale: function(scale){
        var analyser = Object.create(analyserPrototype);

        analyser.scale = scale;
        analyser.played = {
            notes: []
        };

        return analyser;
    }
};