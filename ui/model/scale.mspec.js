'use strict';

var
    chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    mockery = require('mockery'),

    scale;

chai.use(sinonChai);

describe('scale', function(){
    beforeEach(function(){
        mockery.enable({
            warnOnReplace: true
        });

        mockery.registerAllowable('./MusicModesData.json');
        mockery.registerAllowable('./note');
        mockery.registerAllowable('./scale');

        scale = require('./scale');
    });

    afterEach(function(){
        mockery.disable();
    });

    describe('createScale', function(){
        it('should create a new scale object', function(){
            var s1 = scale.createScale('Major', 'C4'),
                s2 = scale.createScale('Dorian', 'Ef3');

            expect(s1).not.to.deep.equal(s2);
            expect(1).to.equal(1);
        });
    });
});