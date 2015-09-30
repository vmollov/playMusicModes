'use strict';

var
    chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    mockery = require('mockery'),

    transposer;

chai.use(sinonChai);

describe('transposer', function(){
    beforeEach(function(){
        mockery.enable({
            warnOnreplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('./standardTranspositionsData.json');
        mockery.registerAllowable('./transposer');
        mockery.registerAllowable('./enharmonicsData.json');
        mockery.registerAllowable('./note');

        transposer = require('./transposer');
    });
    afterEach(function(){
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should return a singleton object', function(){
        var
            transpObj = transposer.getTransposer(),
            transpObj2 = transposer.getTransposer();

        expect(transpObj).to.deep.equal(transpObj2);
    });

    describe('transposer.setTransposition/transposer.removeTransposition', function(){
        it('should set transposition', function(){
            var
                transpObj = transposer.getTransposer(),
                note = require('./note').noteFromNameString('C4');

            transpObj.setTransposition({semitones: -2, steps: -1});
            expect(note.name).to.equal('Bf3');
            transpObj.removeTransposition();
            expect(note.name).to.equal('C4');
            transpObj.removeTransposition();
        });
    });
    describe('transposer.transpose', function(){
        it('should return a transposition object', function(){
            var
                transpObj = transposer.getTransposer(),
                note = require('./note').noteFromNameString('C4'),
                transposed;

            transpObj.setTransposition({ semitones: -3, steps: -2 });
            transposed = transpObj.transpose(note);
            expect(transposed).to.have.property('semitones').that.equals(-3);
            expect(transposed).to.have.property('steps').that.equals(-2);
            expect(transposed).to.have.property('letter').that.equals('A');
            expect(transposed).to.have.property('accidental').that.equals('n');
            expect(transposed).to.have.property('octave').that.equals(3);
            transpObj.removeTransposition();
        });
    });
});