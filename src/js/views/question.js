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
