var Game = require('./game');

module.exports = Backbone.Model.extend({
    initialize: function(){
        this.game = new Game();
        this.nextQuestion();
    },
    isCorrect: function(choice){
        var correct = this.get('choices')[choice] === this.get('answer');

        this.game.updateScore(this.get('kana'), correct);

        if(correct){
            this.game.unlockNextRow();
        }

        return correct;
    },
    nextQuestion: function(){
        this.set(this.game.getQuestion());
    }
});
