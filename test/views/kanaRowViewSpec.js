/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var Game = require('../../src/js/models/game');
var KanaRow = require('../../src/js/models/kana-row').KanaRow;
var KanaRowView = require('../../src/js/views/kana-row-view');

describe('KanaRowView', function(){
    var game = new Game();
    var gameRow = game.game[0];
    var model = new KanaRow({row: gameRow})
    var kanaRowView;

    beforeEach(function(){
        kanaRowView = new KanaRowView({model: model});
        kanaRowView.render();
    });

    afterEach(function(){
        kanaRowView.remove();
    });

    it('renders a representation of the kana row', function(){
        expect(kanaRowView.$el).toContainHtml(_.pluck(gameRow, 'kana').join(' '));
    });

    it('cycles between status in the correct order', function(){
        expect(model.getStatus()).toBe('unlocked');

        var status_ = ['locked', 'pristine', 'unlocked'];

        _.each(status_, function(sta){
            kanaRowView.toggleStatus();
            expect(model.getStatus()).toBe(sta);
        });
    });

});
