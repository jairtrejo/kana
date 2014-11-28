/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game'),
    Question = require('../../src/js/models/question');

describe('Question', function(){
    var game;

    beforeEach(function(){
        window.localStorage.clear();
        game = new Game();
    });

    it('should set game as property, not attribute', function(){
        var q = new Question(game.getQuestion(), {game: game});

        expect(q.game).toEqual(game);
        expect(q.get('game')).toBeUndefined();
    });

    describe('Question.isCorrect', function(){
        it('should return true for the right answer only', function(){
            var i;
            var q = new Question(game.getQuestion(), {game: game});
            var correct = q.get('choices').indexOf(q.get('answer'));

            for(i=0; i < q.get('choices').length; ++i){
                expect(q.isCorrect(i)).toBe(i == correct);
            }
        });
    });

    describe('Question.nextQuestion', function(){
        it('sets the game\'s next question as model attributes', function(){
            var gq = game.getQuestion();
            var q = new Question(game.getQuestion(), {game: game});

            spyOn(game, 'getQuestion').and.returnValue(gq);
            q.nextQuestion();

            expect(game.getQuestion).toHaveBeenCalled();
            expect(q.get('question')).toEqual(gq.question);
            expect(q.get('answer')).toEqual(gq.answer);
        });
    });
});

