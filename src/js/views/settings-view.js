module.exports = Backbone.View.extend({
    tagName: 'div',
    className: 'settings',
    template: _.template($('#settings-template').html()),
    isDialog: true,
    render: function(){
        this.$el.html(this.template());
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
            console && console.log('Animation ended');
            if (_.isFunction(callback)) {
                callback();
            }
        });

        view.$el.addClass('leave');
    }
});

