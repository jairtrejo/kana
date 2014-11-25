var kana = require('./kana'),
    game;

module.exports = Backbone.Model.extend({
    initialize: function(){
        this.nextQuestion();
    },
    isCorrect: function(choice){
        var correct = this.get('choices')[choice] === this.get('answer');

        updateScore(this.get('kana'), correct);

        if(correct){
            unlockNextRow();
            saveGame();
        }

        return correct;
    },
    nextQuestion: function(){
        this.set(getQuestion());
    }
});

function initRow(row){
    _.forEach(row, function(q){
        q.score = {correct: 0, incorrect: 0};
    });
}

function getAvailable(rows){
    return _.filter(_.flatten(rows), function(kana){
        return kana.score;
    });
}

function updateScore(kana, correct){
    kana.score[correct ? 'correct' : 'incorrect'] += 1;
}

function getQuestion(){
    var available = getAvailable(game);

    var fields = Math.random() > 0.5 ? ['sound', 'kana'] : ['kana', 'sound'],
        questionField = fields[0], answerField = fields[1];

    var questionKana = _.sample(available);

    question = {
        kana: questionKana,
        question:questionKana[questionField],
        answer: questionKana[answerField]
    };

    var choices = _.chain(available)
                   .filter(function(kana){
                       return kana[answerField] !== question.answer &&
                              kana[questionField] !== question.question;
                    })
                   .sample(3)
                   .pluck(answerField)
                   .value();

    choices.push(question.answer);

    question.choices = _.shuffle(choices);

    return question;
}

function unlockNextRow(){
    var nextToUnlock = _.find(game, function(row){
        return !row[0].score;
    });

    var allLearned = _.every(getAvailable(game), function(kana){
            var attempts = kana.score.correct + kana.score.incorrect,
                errorRatio = attempts > 0 ? kana.score.incorrect / attempts : 1;
            return errorRatio < 0.5;
        });

    if (nextToUnlock && allLearned){
        initRow(nextToUnlock);
    }
}

function saveGame(){
    localStorage && localStorage.setItem("game", JSON.stringify(game));
}

function loadGame(){
    return (localStorage && JSON.parse(localStorage.getItem("game"))) ||
           kana.hiragana.concat(kana.katakana);
}

function newGame(){
    game = loadGame();
    initRow(game[0]);
}

newGame();
