var AppView = require('./views/app-view'),
    AppRouter = require('./routers/app-router'),
    Game = require('./models/game');

$(function(){
    var appView = new AppView();
    $('body').prepend(appView.$el);
    var router = new AppRouter({ appView: appView, game: new Game() });
    Backbone.history.start();
});
