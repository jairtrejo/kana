var fs = require('fs');
require('browsernizr/test/css/animations');
var Modernizr = require('browsernizr');

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "game",
    events: {
        "click .answer": "tryAnswer",
    },

    template: _.template(fs.readFileSync(__dirname + '/../../templates/question.html', 'utf8')),

    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    transitionIn: function(callback){
        var view = this;

        var animateIn = function(){
            function success(){
                view.$el.removeClass('is-visible');
                if(_.isFunction(callback)){
                    callback();
                }
            }

            if(Modernizr.cssanimations){
                view.$el.one('webkitAnimationEnd animationend', success);
            }
            else{
                _.delay(success, 1000);
            }

            view.$el.addClass('is-visible');
        }

        _.delay(animateIn, 20);
    },
    transitionOut: function(callback){
        callback();
    },
    tryAnswer: function(event){
        var view = this;
        var button = $(event.target);
        var choice = parseInt(button.data('choice'));

        var isCorrect = this.model.isCorrect(choice);

        if(isCorrect){
            this.$('.answer').addClass('invisible');

            button.removeClass('invisible');

            this.$el.addClass('correct');

            _.delay(function(){
                view.nextQuestion();
                view.$el.removeClass('correct');
            }, 1000);
        }
        else{
            if(Modernizr.cssanimations){
                view.$el.addClass('wrong');

                view.$el.one('webkitAnimationEnd animationend',
                    function(){
                        view.$el.removeClass('wrong');
                    }
                );
            }

            button.prop('disabled', true);
        }
    },

    nextQuestion: function(){
        this.transitionIn();
        this.model.nextQuestion();
    }
});
