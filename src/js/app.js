var Question = require('./models/question');
var QuestionView = require('./views/question');

$(function(){
    var question = new Question();
    var questionView = new QuestionView(question);
    $('#app').append(questionView.render().$el);
});
