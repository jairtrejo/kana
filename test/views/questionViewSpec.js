/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game');
var Question = require('../../src/js/models/question');
var QuestionView = require('../../src/js/views/question-view');
var Modernizr = require('browsernizr');


describe('QuestionView', function(){
    var game = new Game();
    var question;
    var questionView;

    beforeEach(function(){
        question = new Question(game.getQuestion(), {game: game});
        questionView = new QuestionView({model: question});
        questionView.render();
    });

    describe('QuestionView.transitionIn', function(){

        beforeEach(function(){
            jasmine.clock().install();
        });

        afterEach(function(){
            jasmine.clock().uninstall();
        });

        it('calls it\'s callback after transition', function(done){
            questionView.transitionIn(done);
            jasmine.clock().tick(20);

            expect(questionView.$el).toHaveClass('is-visible');
            questionView.$el.trigger('animationend');
        });

        it('still calls it\'s callback with no transition support', function(done){
            var support = Modernizr.cssanimations;
            Modernizr.cssanimations = false;

            questionView.transitionIn(done);
            jasmine.clock().tick(20);

            expect(questionView.$el).toHaveClass('is-visible');
            jasmine.clock().tick(1001);

            Modernizr.cssanimations = support;
        });

    });

    describe('QuestionView.transitionOut', function(){

        beforeEach(function(){
            jasmine.clock().install();
        });

        afterEach(function(){
            jasmine.clock().uninstall();
        });

        it('calls it\'s callback after transition', function(done){
            questionView.transitionOut(done);

            // Delayed event setup
            jasmine.clock().tick(20);

            questionView.$el.trigger('animationend');
        });

        it('still calls it\'s callback with no transition support', function(done){
            var support = Modernizr.cssanimations;
            Modernizr.cssanimations = false;

            questionView.transitionOut(done);

            // Delayed event setup
            jasmine.clock().tick(20);

            // Time out for browsers that don't support animations
            jasmine.clock().tick(1000);

            Modernizr.cssanimations = support;
        });
    });

    describe('QuestionView.tryAnswer', function(){
        var $button = $('<button type="button" data-choice="0"></button>');

        beforeEach(function(){
            jasmine.clock().install();
        });

        afterEach(function(){
            jasmine.clock().uninstall();
        });

        describe('when the right button is pressed', function(){
            var correct;

            beforeEach(function(){
                correct = question.get('answer');
                question.get('choices')[0] = correct;
            });

            it('leaves the correct button visible', function(){
                questionView.tryAnswer({target: $button.get(0)});

                expect($button).not.toHaveClass('invisible');
            });

            it('sets appropiate classes on the incorrect buttons', function(){
                questionView.tryAnswer({target: $button.get(0)});

                questionView.$('.answer').each(function(){
                    if($(this).text() !== correct){
                        expect(this).toHaveClass('invisible');
                    }
                });
            });

            it('sets and unsets correct class on the parent element', function(){
                questionView.tryAnswer({target: $button.get(0)});
                jasmine.clock().tick(20);

                expect(questionView.$el).toHaveClass('correct');

                jasmine.clock().tick(1000);

                expect(questionView.$el).not.toHaveClass('correct');
            });

            it('resets the question after a second', function(){
                spyOn(questionView, 'nextQuestion').and.callThrough();
                spyOn(questionView, 'transitionIn');

                questionView.tryAnswer({target: $button.get(0)});

                jasmine.clock().tick(1000);

                expect(questionView.nextQuestion).toHaveBeenCalled();
                expect(questionView.transitionIn).toHaveBeenCalled();
            });
        });

        describe('when the wrong button is pressed', function(){
            beforeEach(function(){
                question.get('choices')[0] = 'x';
            });

            it('disables the button', function(){
                questionView.tryAnswer({target: $button.get(0)});

                jasmine.clock().tick(20);

                expect($button).toBeDisabled();
            });

            it('sets the appropiate class on the question', function(){
                questionView.tryAnswer({target: $button.get(0)});

                jasmine.clock().tick(25);

                expect(questionView.$('.question')).toHaveClass('wrong');
            });
        });

    });
});
