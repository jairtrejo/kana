var Question = require('../models/question');

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "game",
    template: _.template($('#question-template').html()),
    events: {
        "click .answer": "tryAnswer"
    },
    initialize: function(){
        this.model = new Question();
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
            $('.answer').addClass('hidden');
            button.addClass('correct');
            button.removeClass('hidden');
            $('#correct').removeClass('hidden');
            window.setTimeout(function(){ that.model = new Question(); that.render() }, 1000);
        }
        else{
            button.prop('disabled', true);
        }
    }
});
