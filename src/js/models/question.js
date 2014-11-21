var kana = require('./kana'),
    rows;

module.exports = Backbone.Model.extend({
    defaults: function(){
        return getQuestion();
    },
    isCorrect: function(choice){
        var correct = this.get('choices')[choice] === this.get('answer');

        updateScore(this.get('kana'), correct);

        if(correct){
            unlockNextRow();
        }

        return correct;
    }
});

function initRow(row){
    _.forEach(row, function(q){
        q.score = {correct: 0, incorrect: 0};
    });
};

function getAvailable(rows){
    return _.filter(_.flatten(rows), function(kana){
        return kana.score;
    });
}

function updateScore(kana, correct){
    kana.score[correct ? 'correct' : 'incorrect'] += 1;
    console && console.log(kana);
}

function getQuestion(){
    var available = getAvailable(rows);

    var fields = Math.random() > 0.5 ? ['sound', 'kana'] : ['kana', 'sound'],
        questionField = fields[0], answerField = fields[1];

    var questionKana = _.sample(available);

    question = {
        kana: questionKana,
        question:questionKana[questionField],
        answer: questionKana[answerField]
    }

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

function unlockNextRow(){
    var nextToUnlock = _.find(rows, function(row){
        return !row[0].score;
    });

    var allLearned = _.every(getAvailable(rows), function(kana){
            var attempts = kana.score.correct + kana.score.incorrect,
                errorRatio = attempts > 0 ? kana.score.incorrect / attempts : 1;
            return errorRatio < 0.5;
        });

    if (nextToUnlock && allLearned){
        initRow(nextToUnlock);
    }
}

function init(){
    rows = kana.hiragana.concat(kana.katakana);
    initRow(rows[0]);
}

init();
