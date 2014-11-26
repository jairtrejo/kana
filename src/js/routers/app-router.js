var Question = require('../models/question'),
    QuestionView = require('../views/question'),
    SettingsView = require('../views/settings-view');

module.exports = Backbone.Router.extend({
    routes: {
        'settings': 'settings',
        '': 'home'
    },
    initialize: function(options){
        this.game = options.game;
        this.appView = options.appView;
    },
    settings: function(){
        var settingsView = new SettingsView();
        this.appView.goTo(settingsView);
    },
    home: function(){
        var question = new Question(this.game.getQuestion(), {game: this.game});
        var questionView = new QuestionView({model: question});
        this.appView.goTo(questionView);
    }
});
