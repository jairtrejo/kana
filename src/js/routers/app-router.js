var Question = require('../models/question'),
    KanaRowCollection = require('../models/kana-row').KanaRowCollection,
    QuestionView = require('../views/question-view'),
    SettingsView = require('../views/settings-view');

module.exports = Backbone.Router.extend({
    routes: {
        'settings': 'settings',
        '': 'home'
    },
    initialize: function(options){
        this.game = options.game;

        var question = new Question(this.game.getQuestion(), {game: this.game});
        this.questionView = new QuestionView({model: question});

        this.appView = options.appView;
    },
    settings: function(){
        var krc = new KanaRowCollection();

        _.each(this.game.game, function(row){
            krc.add({id: row[0].kana, row: row});
        });

        var settingsView = new SettingsView({ model: krc });
        this.appView.goTo(settingsView);
    },
    home: function(){
        this.questionView.model.nextQuestion();
        this.appView.goTo(this.questionView);
    }
});
