/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game'),
    KanaRow = require('../../src/js/models/kana-row').KanaRow;

describe('KanaRow', function(){
    var game;

    beforeEach(function(){
        window.localStorage.clear();
        game = new Game();
    });

    it('should be able to cycle through states', function(){
        var kr = new KanaRow({row: game.game[1]});

        expect(kr.getStatus()).toBe('pristine')

        kr.unlock();
        expect(kr.getStatus()).toBe('unlocked');

        kr.lock();
        expect(kr.getStatus()).toBe('locked')

        kr.reset();
        expect(kr.getStatus()).toBe('pristine')
    });
})
