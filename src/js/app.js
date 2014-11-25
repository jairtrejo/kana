var AppView = require('./views/app-view'),
    AppRouter = require('./routers/app-router');

$(function(){
    if(window.navigator.standalone){
        $('nav').css('padding-top', '15px');
        $('body').css('padding-top', '85px');
    }
    var appView = new AppView();
    var router = new AppRouter(appView);

    Backbone.history.start();
});
