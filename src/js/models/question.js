module.exports = Backbone.Model.extend({
    initialize: function(attributes, options){
        this.game = options.game;
    },
    isCorrect: function(choiceNumber){
        var correct = this.get('choices')[choiceNumber] === this.get('answer');

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
