var QuestionView = require('./views/question');

$(function(){
    var question = new QuestionView();
    $('#app').append(question.render().$el);
});
