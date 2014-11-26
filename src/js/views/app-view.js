module.exports = Backbone.View.extend({
    el: '#app',
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
            this.$el.prepend(next.render().$el);
        }

        var me = this;
        this.toggleIcon(next.isDialog);
        next.transitionIn();

        this.currentPage = next;
    },
    toggleIcon: function(isDialog){
        var $icon;
        if(isDialog){
            $icon = $('.fa-cog');
            $icon.removeClass('fa-cog')
                 .addClass('fa-times')
                 .parent()
                 .attr('href', '#');
        }
        else{
            $icon = $('.fa-times');
            $icon.removeClass('fa-times')
                 .addClass('fa-cog')
                 .parent()
                 .attr('href', '#settings');
        }
    }
});

