/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game'),
    AppView = require('../../src/js/views/app-view'),
    SettingsView = require('../../src/js/views/settings-view'),
    QuestionView = require('../../src/js/views/question-view'),
    AppRouter = require('../../src/js/routers/app-router');

describe('AppRouter', function(){
    var game = new Game(),
        router;

    beforeEach(function(){
        Backbone.history.start();
        router = new AppRouter({game: game, appView: new AppView()});
    });

    it('asks it\'s AppView to go to the appropiate view', function(){
        spyOn(router.appView, 'goTo');

        router.navigate('settings', {trigger: true});
        var switchedTo = router.appView.goTo.calls.mostRecent().args[0];
        expect(switchedTo).toEqual(jasmine.any(SettingsView));

        router.navigate('', {trigger: true});
        var switchedTo = router.appView.goTo.calls.mostRecent().args[0];
        expect(switchedTo).toEqual(jasmine.any(QuestionView));
    });

    it('resets question when going to home route', function(){
        spyOn(router.questionView, 'nextQuestion');

        // Needs to navigate away first
        router.navigate('settings', {trigger: true});
        router.navigate('', {trigger: true});

        expect(router.questionView.nextQuestion).toHaveBeenCalled();
    });

    it('passes a KanaRowCollection to the settings view', function(){
        spyOn(router.appView, 'goTo');
        router.navigate('settings', {trigger: true});
        var settingsView = router.appView.goTo.calls.mostRecent().args[0];

        expect(settingsView.model.size()).toEqual(game.game.length);
    });

    afterEach(function(){
        Backbone.history.stop();
    });
});
