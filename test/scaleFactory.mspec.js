'use strict';

require('sinon');

var
    expect = require('chai').expect,
    mockery = require('mockery'),
    scaleFactory;

describe('scaleFactory', function(){
    beforeEach(function(){
        mockery.enable({
            warnOnReplace: false,
            useCleanCache: true
        });

        mockery.registerAllowable('./data/musicModes');
        mockery.registerAllowable('./MusicModesData.json');
        mockery.registerAllowable('./data/enharmonics');
        mockery.registerAllowable('./enharmonicsData.json');
        mockery.registerAllowable('./noteFactory');
        mockery.registerAllowable('../ui/model/scaleFactory');
        mockery.registerAllowable('./transposer');

        scaleFactory = require('../ui/model/scaleFactory');
    });

    afterEach(function(){
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('createScale', function(){
        it('should create a new scale object', function(){
            var s1 = scaleFactory.createScale('Major', 'C4'),
                s2 = scaleFactory.createScale('Dorian', 'Ef3');

            expect(s1).not.to.deep.equal(s2);
        });
    });
});