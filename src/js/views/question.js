module.exports = Backbone.View.extend({
    tagName: "div",
    className: "game",
    template: _.template($('#question-template').html()),
    events: {
        "click .answer": "tryAnswer"
    },
    initialize: function(model){
        this.model = model;
        this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    transitionIn: function(callback){
        var view = this;

        var animateIn = function(){
            view.$el.addClass('is-visible');
            view.$el.one('transitioned', function(){
                if(_.isFunction(callback)){
                    callback();
                }
            });
        }

        _.delay(animateIn, 20);
    },
    tryAnswer: function(event){
        var that = this;
        var button = $(event.toElement);
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
            button.prop('disabled', true);
        }
    }
});
