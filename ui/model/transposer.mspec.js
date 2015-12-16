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
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('./transposer');
        mockery.registerAllowable('./noteFactory');
        mockery.registerAllowable('./data/enharmonics');
        mockery.registerAllowable('./enharmonicsData.json');

        transposer = require('./transposer');
    });
    after(function(){
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should return a singleton object', function(){
        var
            instance1 = require('./transposer'),
            instance2 = require('./transposer');

        expect(instance1).to.deep.equal(instance2);
    });

    describe('transposer.setTransposition/transposer.removeTransposition', function(){
        it('should set transposition', function(){
            var note = require('./noteFactory').noteFromNameString('C4');

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
                note = require('./noteFactory').noteFromNameString('C4'),
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