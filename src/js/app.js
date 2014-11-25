var Question = require('./models/question');
var QuestionView = require('./views/question');

$(function(){
    if(window.navigator.standalone){
        $('nav').css('padding-top', '15px');
        $('body').css('padding-top', '85px');
    }
    var question = new Question();
    var questionView = new QuestionView(question);
    $('#app').append(questionView.render().$el);
});
