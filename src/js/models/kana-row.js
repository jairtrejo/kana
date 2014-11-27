var KanaRow = Backbone.Model.extend({
    getStatus: function(){
        var q = this.get('row')[0];
        if (q.locked) {
            return 'locked';
        }
        else if (q.score){
            return 'unlocked';
        }
        else{
            return 'pristine';
        }
    },
    lock: function(){
        _.forEach(this.get('row'), function(q){
            q.locked = true;
        });
    },
    unlock: function(){
        _.forEach(this.get('row'), function(q){
            q.locked = false;
            if(!q.score){
                q.score = {correct: 0, incorrect: 0};
            }
        });
    },
    reset: function(){
        _.forEach(this.get('row'), function(q){
            q.locked = false;
            q.score = undefined;
        });
    }
});

var KanaRowCollection = Backbone.Collection.extend({
    model: KanaRow
});

module.exports = {
    KanaRow: KanaRow,
    KanaRowCollection: KanaRowCollection
};
