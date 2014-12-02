/* jshint jasmine:true, browser:true, node:true */
/* global _ */

'use strict';

var AppView = require('../../src/js/views/app-view');

describe('AppView', function(){
    var appView;

    beforeEach(function(){
        appView = new AppView();
    });

    afterEach(function(){
        appView.remove();
    });

    function fakeView(inCallback, outCallback){
        var view = jasmine.createSpyObj('view',
            ['render', 'remove', 'transitionIn', 'transitionOut']);

        function callCallbacks(additional){
            return function(callback){
                if(_.isFunction(callback)){
                    callback();
                }

                _.chain(additional)
                 .filter(_.isFunction)
                 .each(function(callback){
                     callback();
                 });
            }
        }

        view.render.and.callFake(function(){ return $('<div></div>'); });
        view.transitionIn.and.callFake(callCallbacks([inCallback]));
        view.transitionOut.and.callFake(callCallbacks([outCallback]));

        return view;
    }

    it('it adds padding for iOS status bar', function(){
        appView.remove();
        window.navigator.standalone = true;

        appView = new AppView();
        expect(appView.$el.find('nav').css('padding-top')).toBe('15px');

        window.navigator.standalone = false;
    });

    describe('AppView.goTo', function(){
        it('Transitions in new views', function(){
            var view = fakeView();

            appView.goTo(view);

            expect(view.transitionIn).toHaveBeenCalled();
        });

        it('Transitions out old views', function(){
            var view1 = fakeView();
            var view2 = fakeView();

            appView.goTo(view1);
            appView.goTo(view2);

            expect(view1.transitionOut).toHaveBeenCalled();
        });

        it('removes previous view if new one is not dialog', function(done){
            var view1 = fakeView();
            var view2 = fakeView(function(){
                expect(view1.remove).toHaveBeenCalled();
                done();
            });

            appView.goTo(view1);
            appView.goTo(view2);
        });

        it('doesn\'t removes previous view if new one is dialog', function(done){
            var view1 = fakeView();
            var view2 = fakeView(function(){
                expect(view1.remove).not.toHaveBeenCalled();
                done();
            });

            view2.isDialog = true;

            appView.goTo(view1);
            appView.goTo(view2);
        });

        it('appends next view if previous one was not dialog', function(done){
            var view1 = fakeView();
            var view2 = fakeView(function(){
                expect(view2.render).toHaveBeenCalled();
                done();
            });

            appView.goTo(view1);
            appView.goTo(view2);
        });

        it('doesn\'t append next view if previous one was dialog', function(done){
            var view1 = fakeView();
            var view2 = fakeView(function(){
                expect(view2.render).not.toHaveBeenCalled();
                done();
            });

            view1.isDialog = true;

            appView.goTo(view1);
            appView.goTo(view2);
        });
    });

    describe('AppView.toggleIcon', function(){

        it('shows close icon for dialogs', function(){
            appView.toggleIcon(true);
            expect(appView.$statusBarIcon.find('i')).toHaveClass('fa-times');
            expect(appView.$statusBarIcon.attr('href')).toBe('#');
        });

        it('shows gear icon for pages', function(){
            appView.toggleIcon(false);
            expect(appView.$statusBarIcon.find('i')).toHaveClass('fa-cog');
            expect(appView.$statusBarIcon.attr('href')).toBe('#settings');
        });

    });
});
