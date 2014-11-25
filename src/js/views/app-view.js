module.exports = Backbone.View.extend({
    el: '#app',
    goTo: function(view){
        var previous = this.currentPage || null;
        var next = view;

        if(previous){
            previous.transitionOut(function(){
                previous.remove();
            });
        }

        this.$el.append(next.render().$el);
        next.transitionIn();
        this.currentPage = next;
    }
});

