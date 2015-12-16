'use strict';

var
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    mockery = require('mockery'),

    noteFactory;

chai.use(sinonChai);

describe('noteFactory', function(){
    beforeEach(function(){
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('./noteFactory');
        mockery.registerAllowable('./data/enharmonics');
        mockery.registerAllowable('./enharmonicsData.json');
        mockery.registerMock('./transposer', {
            transpose: function(trNote){
                return {
                    letter: trNote.letter,
                    accidental: trNote.accidental,
                    octave: trNote.octave
                };
            }
        });

        noteFactory = require('./noteFactory');
    });

    afterEach(function(){
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('noteFromFrequency', function(){
        it('should return a note object from a given frequency', function(){
            var noteObj = noteFactory.noteFromFrequency(441);
            expect(noteObj).to.have.property('letter').that.equals('A');
            expect(noteObj).to.have.property('centsOff').that.equals(3);
        });
        it('should correctly calculate centsOff for a note from a given frequency', function(){
            var noteObj = noteFactory.noteFromFrequency(441);
            expect(noteObj.centsOff).to.equal(3);
        });
        it('should throw if a note cannot be calculated from a freqency', function(){
            expect(function(){ noteFactory.noteFromFrequency(0); }).to.throw();
        });
    });
    describe('noteFromNumber', function(){
        it('should return a note object from a given midi value number', function(){
            var noteObj = noteFactory.noteFromNumber(41);
            expect(noteObj).to.have.property('letter').that.equals('F');
            expect(noteObj).to.have.property('octave').that.equals(2);
        });
        it('should throw if a note cannot be calculated from a number', function(){
            expect(function(){ noteFactory.noteFromNumber(0); }).to.throw();
            expect(function(){ noteFactory.noteFromNumber(150); }).to.throw();
        });
    });
    describe('noteFromNameString', function(){
        it('should throw if it receives an invalid note string', function(){
            expect(function(){ noteFactory.noteFromNameString('sdf'); }).to.throw();
        });
        it('should create a note object with the correct properties', function(){
            var noteObj = noteFactory.noteFromNameString('C4');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('n');
            expect(noteObj).to.have.property('octave').that.equals(4);
            expect(noteObj).to.have.property('midiValue').that.equals(60);

            noteObj = noteFactory.noteFromNameString('Cs4');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('s');
            expect(noteObj).to.have.property('octave').that.equals(4);
            expect(noteObj).to.have.property('midiValue').that.equals(61);

            noteObj = noteFactory.noteFromNameString('Cx4');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('x');
            expect(noteObj).to.have.property('octave').that.equals(4);
            expect(noteObj).to.have.property('midiValue').that.equals(62);

            noteObj = noteFactory.noteFromNameString('Cf4');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('f');
            expect(noteObj).to.have.property('octave').that.equals(4);
            expect(noteObj).to.have.property('midiValue').that.equals(59);

            noteObj = noteFactory.noteFromNameString('Cd4');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('d');
            expect(noteObj).to.have.property('octave').that.equals(4);
            expect(noteObj).to.have.property('midiValue').that.equals(58);
        });
    });
    describe('note.changeToEnharmonic', function(){
        it('should throw when no enharmonic exists for the requested input', function(){
            var noteObj = noteFactory.noteFromNameString('C4');
            expect(function(){ var enharmonic = noteObj.changeToEnharmonic('E'); }).to.throw();
        });
        it('should change the note to the correct enharmonic', function(){
            var noteObj = noteFactory.noteFromNameString('B3');
            noteObj.changeToEnharmonic('C');
            expect(noteObj).to.have.property('letter').that.equals('C');
            expect(noteObj).to.have.property('accidental').that.equals('f');
            expect(noteObj).to.have.property('octave').that.equals(4);
        });
    });
    describe('note.buildInterval', function(){
        it('should throw if an interval cannot be calculated from the provided input', function(){
            var noteObj = noteFactory.noteFromNameString('c4');
            expect(function(){ noteObj.buildInterval(-1, 1); }).to.throw();
        });
        it('should return a new note object set to the correct note', function(){
            var noteObj = noteFactory.noteFromNameString('c4'),
                noteObj2 = noteObj.buildInterval(3, 1);

            expect(noteObj2).to.have.property('letter').that.equals('D');
            expect(noteObj2).to.have.property('accidental').that.equals('s');

            noteObj = noteObj2.buildInterval(-6, -2);
            expect(noteObj).to.have.property('letter').that.equals('B');
            expect(noteObj).to.have.property('accidental').that.equals('d');
            expect(noteObj).to.have.property('octave').that.equals(3);

            noteObj2 = noteObj.buildInterval(11, 6);
            expect(noteObj2).to.have.property('letter').that.equals('A');
            expect(noteObj2).to.have.property('accidental').that.equals('f');
            expect(noteObj2).to.have.property('octave').that.equals(4);
        });
    });
    describe('note.name', function(){
        it('should return the standard note name', function(){
            var noteObj = noteFactory.noteFromNameString('C4');
            expect(noteObj).to.have.property('name').that.equals('C4');
            noteObj = noteFactory.noteFromNameString('Cx4');
            expect(noteObj).to.have.property('name').that.equals('Cx4');
        });
    });
    describe('note.nameWithAccidental', function(){
        it('should return the standard note name', function(){
            var noteObj = noteFactory.noteFromNameString('C4');
            expect(noteObj).to.have.property('nameWithAccidental').that.equals('Cn4');
            noteObj = noteFactory.noteFromNameString('Cx4');
            expect(noteObj).to.have.property('nameWithAccidental').that.equals('Cx4');
        });
    });
    describe('note.nameBase', function(){
        it('should return the standard note name', function(){
            var noteObj = noteFactory.noteFromNameString('C4');
            expect(noteObj).to.have.property('nameBase').that.equals('C');
            noteObj = noteFactory.noteFromNameString('Cx4');
            expect(noteObj).to.have.property('nameBase').that.equals('Cx');
        });
    });
});