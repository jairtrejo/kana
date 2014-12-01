var fs = require('fs');

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
            view.$el.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(){
                if(_.isFunction(callback)){
                    callback();
                }
            });
            view.$el.addClass('is-visible');
        }

        _.delay(animateIn, 20);
    },
    transitionOut: function(callback){
        callback();
    },
    tryAnswer: function(event){
        var that = this;
        var button = $(event.target);
        var choice = parseInt(button.data('choice'));

        var isCorrect = this.model.isCorrect(choice);

        if(isCorrect){
            $('.answer').addClass('invisible');

            button.removeClass('invisible');
            button.addClass('correct');

            $('#correct').removeClass('hidden');

            window.setTimeout(function(){ that.model.nextQuestion(); }, 1000);
        }
        else{
            this.$('.question').removeClass('wrong');
            _.delay(function(){this.$('.question').addClass('wrong');}, 20);
            button.prop('disabled', true);
        }

        event.preventDefault();
        event.stopPropagation();
    },

    nextQuestion: function(){
        this.model.nextQuestion();
    }
});