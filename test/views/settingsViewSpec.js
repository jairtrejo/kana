/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game');
var SettingsView = require('../../src/js/views/settings-view');
var KanaRowCollection = require('../../src/js/models/kana-row').KanaRowCollection;
var Modernizr = require('browsernizr');


describe('SettingsView', function(){
    var game = new Game();
    var settingsView;

    beforeEach(function(){
        settingsView = new SettingsView({model: new KanaRowCollection()});
        settingsView.render();
    });

    describe('SettingsView.transitionIn', function(){

        beforeEach(function(){
            jasmine.clock().install();
        });

        afterEach(function(){
            jasmine.clock().uninstall();
        });

        it('calls it\'s callback after transition', function(done){
            settingsView.transitionIn(done);
            jasmine.clock().tick(20);

            expect(settingsView.$el).toHaveClass('is-visible');
            settingsView.$el.trigger('animationend');
        });

        it('still calls it\'s callback with no transition support', function(done){
            var support = Modernizr.cssanimations;
            Modernizr.cssanimations = false;

            settingsView.transitionIn(done);
            jasmine.clock().tick(20);

            expect(settingsView.$el).toHaveClass('is-visible');
            jasmine.clock().tick(1001);

            Modernizr.cssanimations = support;
        });

    });

    describe('SettingsView.transitionOut', function(){

        beforeEach(function(){
            jasmine.clock().install();
        });

        afterEach(function(){
            jasmine.clock().uninstall();
        });

        it('calls it\'s callback after transition', function(done){
            settingsView.transitionOut(done);

            // Delayed event setup
            jasmine.clock().tick(20);

            settingsView.$el.trigger('animationend');
        });

        it('still calls it\'s callback with no transition support', function(done){
            var support = Modernizr.cssanimations;
            Modernizr.cssanimations = false;

            settingsView.transitionOut(done);

            // Delayed event setup
            jasmine.clock().tick(20);

            // Time out for browsers that don't support animations
            jasmine.clock().tick(1000);

            Modernizr.cssanimations = support;
        });
    });
});
