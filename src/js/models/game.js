var fs = require('fs');

module.exports = Game;

function Game(){
    this.game = loadGame();
    this.unlockNextRow();
}

Game.prototype.getQuestion = function(){
    var available = getAvailable(this.game);

    if(available.length === 0){
        this.unlockNextRow();
        available = getAvailable(this.game);
    }

    var fields = Math.random() > 0.5 ? ['sound', 'kana'] : ['kana', 'sound'],
        questionField = fields[0], answerField = fields[1];

    var questionKana = pickQuestion(available);

    var question = {
        kana: questionKana,
        question: questionKana[questionField],
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
        return !row[0].score && !row[0].locked;
    });

    var allLearned = _.every(getAvailable(this.game), function(kana){
            return kana.score.correct >= 3;
        });

    if (nextToUnlock && allLearned){
        initRow(nextToUnlock);
    }

    saveGame(this.game);
};

function loadGame(){
    var kana = JSON.parse(
        fs.readFileSync(__dirname + '/kana.json', 'utf8')
    );
    return (localStorage && JSON.parse(localStorage.getItem("game"))) ||
           kana.hiragana.concat(kana.katakana);
}

function initRow(row){
    _.forEach(row, function(q){
        q.score = {correct: 0, incorrect: 0};
    });
}

function pickQuestion(options){
    var byAttempts = _.sortBy(options, function(kana){
        return kana.score.correct + kana.score.incorrect;
    }),
        pivot = Math.ceil(byAttempts.length * 0.2),
        recent = _.initial(byAttempts, pivot),
        old = _.last(byAttempts, byAttempts.length - pivot),
        picked = undefined;

    if(Math.random() > 0.2){
        picked = _.sample(recent);
    }
    else{
        picked = _.sample(old);
    }

    return picked;
}

function getAvailable(rows){
    return _.filter(_.flatten(rows), function(kana){
        return kana.score && !kana.locked;
    });
}

function saveGame(game){
    return localStorage && localStorage.setItem("game", JSON.stringify(game));
}
