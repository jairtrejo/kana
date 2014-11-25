var KanaList = require('./kana');

module.exports = Game;

function Game(){
    this.game = loadGame();
    this.unlockNextRow();
}

Game.prototype.getQuestion = function(){
    var available = getAvailable(this.game);

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
};

Game.prototype.updateScore = function(kana, correct){
    kana.score[correct ? 'correct' : 'incorrect'] += 1;
};

Game.prototype.unlockNextRow = function(){
    var nextToUnlock = _.find(this.game, function(row){
        return !row[0].score;
    });

    var allLearned = _.every(getAvailable(this.game), function(kana){
            var attempts = kana.score.correct + kana.score.incorrect,
                errorRatio = attempts > 0 ? kana.score.incorrect / attempts : 1;
            return errorRatio < 0.5;
        });

    if (nextToUnlock && allLearned){
        initRow(nextToUnlock);
    }

    saveGame(this.game);
};

function loadGame(){
    return (localStorage && JSON.parse(localStorage.getItem("game"))) ||
           KanaList.hiragana.concat(KanaList.katakana);
}

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

function saveGame(game){
    return localStorage && localStorage.setItem("game", JSON.stringify(game));
}
