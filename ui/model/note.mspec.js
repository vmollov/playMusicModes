'use strict';

var
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    mockery = require('mockery'),

    note;

chai.use(sinonChai);

describe('note', function(){

    var note;

    beforeEach(function(){
        mockery.enable({
            warnOnReplace: false
        });

        mockery.registerAllowable('./note');
        mockery.registerAllowable('./enharmonicsData.json');

        note = require('./note');
    });

    describe('noteFromFrequency', function(){
        it('should return a note object from a given frequency', function(){
            var noteObj = note.noteFromFrequency(441);
            expect(noteObj).to.have.property('letter').that.equals('A');
            expect(noteObj).to.have.property('centsOff').that.equals(3);
        });
        it('should correctly calculate centsOff for a note from a given frequency', function(){

        });
        it('should throw an exception if a note cannot be calculated from a freqency', function(){

        });
    });
});