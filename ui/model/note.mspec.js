'use strict';

describe('note', function(){
    //var mockery = require('mockery');

    beforeEach(function(){
       /* mockery.enable({
            warnOnReplace: false
        });*/

        //mockery.registerAllowable('./enharmonicsData.json');
    });

    describe('noteFromFrequency', function(){
        var
            note = require('./note');

        it('should return a note object from a given frequency', function(){
            var noteObj = note.noteFromFrequency(441);
            expect(noteObj).to.have.property('letter').that.equals('A');
        });
        it('should correctly calculate centsOff for a note from a given frequency', function(){
            //expect(1).to.equal(3);
        });
        it('should throw an exception if a note cannot be calculated from a freqency', function(){

        });
    });
});