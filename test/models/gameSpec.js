/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game');

function isLocked(kana){
    return kana.locked || !kana.score;
}

describe('Game', function(){
    var game;

    beforeEach(function(){
        window.localStorage.clear();
        game = new Game();
    });

    it('should use default questions when there is no previous game', function(){
        window.localStorage.clear();
        game = new Game();

        expect(game.game.length).toEqual(55);
    });

    it('should load previous game from localStorage', function(){
        window.localStorage.setItem('game', '{"test": "data"}');
        game = new Game();

        expect(game.game).toEqual({test: 'data'});
    });

    it('should unlock first row in new games', function(){
        expect(_.every(
            game.game[0], function(kana){ return kana.score; }
        )).toBe(true);
    });

    describe('Game.getQuestion', function(){
        var question;

        beforeEach(function(){
            question = game.getQuestion();
        });

        it('Should return valid questions', function(){
            // Question is either the sound or the kana
            expect(
                question.question == question.kana.sound || question.question == question.kana.kana
            ).toBe(true);

            // Answer is the other one
            expect(
                (question.answer !== question.question) &&
                (question.answer === question.kana.sound ||
                 question.answer === question.kana.kana)
            ).toBe(true);

            // There is exactly one correct answer
            expect(
                _.filter(
                    question.choices, function(c){ return c === question.answer; }
                ).length
            ).toBe(1);
        });

        it('Should return unlocked questions', function(){
            expect(question.kana.score).toBeDefined();
            expect(question.kana.locked).toBeFalsy();
        });

        it('Should unlock next row if there are no unlocked rows', function(){
            _.forEach(game.game[0], function(kana){
                kana.score = undefined;
            });

            expect(_.chain(game.game)
                    .flatten()
                    .every(isLocked)
                    .value()
            ).toBe(true);

            var q = game.getQuestion();

            expect(_.chain(game.game)
                    .flatten()
                    .every(isLocked)
                    .value()
            ).toBe(false);
        });

    });

    describe('Game.updateScore', function(){

        it('should increase correct score for right answers', function(){
            var q = game.getQuestion();

            var correct0 = q.kana.score.correct;
            var incorrect0 = q.kana.score.incorrect;

            game.updateScore(q.kana, true);

            expect(q.kana.score.correct).toBeGreaterThan(correct0);
            expect(q.kana.score.incorrect).toEqual(incorrect0);
        });

        it('should increase incorrect score for wrong answers', function(){
            var q = game.getQuestion();

            var correct0 = q.kana.score.correct;
            var incorrect0 = q.kana.score.incorrect;

            game.updateScore(q.kana, false);

            expect(q.kana.score.incorrect).toBeGreaterThan(incorrect0);
            expect(q.kana.score.correct).toEqual(correct0);
        });
    });

    describe('Game.unlockNextRow', function(){

        it('should unlock the first row if all rows are locked', function(){
            _.forEach(game.game[0], function(kana){
                kana.score = undefined;
            });

            game.unlockNextRow();

            expect(_.chain(game.game[0])
                .some(isLocked)
                .value()
            ).toBe(false);
        });

        it('Should unlock a new row only when the last one is learned', function(){
            var i;

            // When last unlocked row is not well learned, no row is unlocked

            game.unlockNextRow();

            expect(_.chain(game.game[1])
                .every(isLocked)
                .value()
            ).toBe(true);

            // Once every question has been answered correctly three times in a row

            _.each(game.game[0], function(kana){
                for(i=0; i < 3; ++i){
                    game.updateScore(kana, true);
                }
            });

            // The next row can be unlocked

            game.unlockNextRow();

            expect(_.chain(game.game[1])
                .some(isLocked)
                .value()
            ).toBe(false);
        });
    });

});
