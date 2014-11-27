module.exports = Backbone.View.extend({

    tagName: "div",

    className: "kana-row row",

    template: _.template($('#kana-row-template').html()),

    events: {
        "click .kana-row": "toggleStatus",
    },

    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },

    render: function(){
        var attrs = this.model.toJSON();

        attrs.status = this.model.getStatus();
        attrs.text = _.pluck(attrs.row, 'kana').join(' ');

        this.$el.html(this.template(attrs));

        return this;
    },

    toggleStatus: function(){
        var status_ = this.model.getStatus();

        switch(status_){
            case 'pristine':
                this.model.unlock();
                break;
            case 'unlocked':
                this.model.lock();
                break;
            case 'locked':
                this.model.reset();
                break;
        }

        this.render();
    }
});

