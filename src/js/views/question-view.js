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
            button.addClass('correct');

            $('#correct').removeClass('hidden');

            window.setTimeout(function(){ view.nextQuestion(); }, 1000);
        }
        else{
            this.$('.question').removeClass('wrong');
            _.delay(function(){ view.$('.question').addClass('wrong'); }, 20);

            button.prop('disabled', true);
        }

        event.preventDefault();
        event.stopPropagation();
    },

    nextQuestion: function(){
        this.model.nextQuestion();
    }
});
