var fs = require('fs');

module.exports = Backbone.View.extend({
    tagName: 'div',

    template: _.template(
        fs.readFileSync(__dirname + '/../../templates/app.html', 'utf8')
    ),

    initialize: function(){
        this.render();
        this.$container = this.$('.screen');
        this.$statusBarIcon = this.$('.status-bar-icon');
    },

    render: function(){
        this.$el.html(this.template());
        if(window.navigator.standalone){
            this.$('nav').css('padding-top', '15px');
        }
    },

    goTo: function(view){
        var previous = this.currentPage || null;
        var next = view;

        if(previous){
            previous.transitionOut(function(){
                if(!next.isDialog){
                    previous.remove();
                }
            });
        }

        if(!previous || !previous.isDialog){
            this.$container.prepend(next.render().$el);
        }

        var me = this;
        this.toggleIcon(next.isDialog);
        next.transitionIn();

        this.currentPage = next;
    },
    toggleIcon: function(isDialog){
        if(isDialog){
            this.$statusBarIcon.attr('href', '#')
            this.$statusBarIcon.html('<i class="fa fa-times"></i>');
        }
        else{
            this.$statusBarIcon.attr('href', '#settings')
            this.$statusBarIcon.html('<i class="fa fa-cog"></i>');
        }
    }
});

