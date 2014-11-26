var AppView = require('./views/app-view'),
    AppRouter = require('./routers/app-router'),
    Game = require('./models/game');

$(function(){
    if(window.navigator.standalone){
        $('nav').css('padding-top', '15px');
        $('body').css('padding-top', '95px');
    }
    var router = new AppRouter({ appView: new AppView(), game: new Game() });

    Backbone.history.start();
});
