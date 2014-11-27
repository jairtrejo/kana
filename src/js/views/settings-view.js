var KanaRowView = require('../views/kana-row-view');

module.exports = Backbone.View.extend({
    tagName: 'div',
    className: 'settings',
    template: _.template($('#settings-template').html()),
    isDialog: true,
    render: function(){
        var view = this;

        this.$el.html(this.template());

        this.model.each(function(kanaRow){
            var krview = new KanaRowView({model: kanaRow});
            view.$('.kana-table').append(krview.render().$el);
        });

        return this;
    },
    transitionIn: function(callback){
        var view = this;

        var animateIn = function(callback){
            view.$el.addClass('is-visible');
            view.$el.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(){
                if(_.isFunction(callback)){
                    callback();
                }
            });
        }

        _.delay(animateIn, 20);
    },
    transitionOut: function(callback){
        var view = this;

        view.$el.removeClass('is-visible');

        view.$el.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function () {
            if (_.isFunction(callback)) {
                callback();
            }
        });

        view.$el.addClass('leave');
    }
});

