var Question = require('../models/question'),
    QuestionView = require('../views/question'),
    SettingsView = require('../views/settings-view');

module.exports = Backbone.Router.extend({
    routes: {
        'settings': 'settings',
        '': 'home'
    },
    initialize: function(appView){
        this.appView = appView;
    },
    settings: function(){
        var settingsView = new SettingsView();
        this.appView.goTo(settingsView);
    },
    home: function(){
        var question = new Question();
        var questionView = new QuestionView(question);
        this.appView.goTo(questionView);
    }
});
