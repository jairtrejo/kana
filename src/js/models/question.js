module.exports = Backbone.Model.extend({
    initialize: function(attributes, options){
        this.game = options.game;
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
