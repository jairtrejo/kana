var KanaRowView = require('../views/kana-row-view');
var fs = require('fs');
require('browsernizr/test/css/animations');
var Modernizr = require('browsernizr');

module.exports = Backbone.View.extend({
    tagName: 'div',
    className: 'settings',
    isDialog: true,

    template: _.template(fs.readFileSync(__dirname + '/../../templates/settings.html', 'utf8')),

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

        var animateIn = function(){
            function success(){
                view.$el.removeClass('is-visible');
                if(_.isFunction(callback)){
                    callback();
                }
            }

            if(Modernizr.cssanimations){
                view.$el.one('webkitAnimationEnd animationend', success);
            }
            else{
                _.delay(success, 1000);
            }

            view.$el.addClass('is-visible');
        }

        _.delay(animateIn, 20);
    },

    transitionOut: function(callback){
        var view = this;

        var animateOut = function(){
            function success(){
                if(_.isFunction(callback)){
                    view.$el.removeClass('leave');
                    callback();
                }
            }

            if(Modernizr.cssanimations){
                view.$el.one('webkitAnimationEnd animationend', success);
            }
            else{
                _.delay(success, 1000);
            }

        }

        _.delay(animateOut, 20);

        view.$el.addClass('leave');
    }
});

