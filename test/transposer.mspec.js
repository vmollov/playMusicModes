'use strict';

require('sinon');

var
    expect = require('chai').expect,
    mockery = require('mockery'),
    transposer, noteFactory;

describe('transposer', function(){
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('../ui/model/transposer');
        mockery.registerAllowable('./transposer');
        mockery.registerAllowable('../ui/model/noteFactory');
        mockery.registerAllowable('./data/enharmonics');
        mockery.registerAllowable('./enharmonicsData.json');

        transposer = require('../ui/model/transposer');
        noteFactory = require('../ui/model/noteFactory');
    });
    after(function(){
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should return a singleton object', function(){
        var anotherInstance = require('../ui/model/transposer');

        expect(anotherInstance).to.deep.equal(transposer);
    });

    describe('transposer.setTransposition/transposer.removeTransposition', function(){
        it('should set/remove transposition', function(){
            var note = noteFactory.noteFromNameString('C4');

            transposer.setTransposition({semitones: -2, steps: -1});
            expect(note.name).to.equal('Bf3');
            transposer.removeTransposition();
            expect(note.name).to.equal('C4');
            transposer.removeTransposition();
        });
    });
    describe('transposer.transpose', function(){
        it('should return a transposition object', function(){
            var
                note = noteFactory.noteFromNameString('C4'),
                transposed;

            transposer.setTransposition({ semitones: -3, steps: -2 });
            transposed = transposer.transpose(note);
            expect(transposed).to.have.property('semitones').that.equals(-3);
            expect(transposed).to.have.property('steps').that.equals(-2);
            expect(transposed).to.have.property('letter').that.equals('A');
            expect(transposed).to.have.property('accidental').that.equals('n');
            expect(transposed).to.have.property('octave').that.equals(3);
            transposer.removeTransposition();
        });
    });
});