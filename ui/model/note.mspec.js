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
    beforeEach(function(){
        mockery.enable({
            warnOnReplace: true
        });

        mockery.registerAllowable('./note');
        mockery.registerAllowable('./enharmonicsData.json');

        note = require('./note');
    });

    afterEach(function(){
        mockery.disable();
    });

    describe('noteFromFrequency', function(){
        it('should return a note object from a given frequency', function(){
            var noteObj = note.noteFromFrequency(441);
            expect(noteObj).to.have.property('letter').that.equals('A');
            expect(noteObj).to.have.property('centsOff').that.equals(3);
        });
        xit('should correctly calculate centsOff for a note from a given frequency', function(){

        });
        xit('should throw an exception if a note cannot be calculated from a freqency', function(){

        });
    });
});