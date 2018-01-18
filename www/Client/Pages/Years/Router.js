define([
   'Pages/Years/Views/Year',
   'css!Pages/Years/Styles/Main'
], function (Year) {
   'use strict';

   var Router = Backbone.Router.extend({
      routes: {
         // '/(.*)/': 'main'
      },
      initialize: function(options) {
         this.route(/(.*)/, 'main');
      },
      main: function(path) {
         console.log('main', arguments);

         new Year({
            el: $('body')
         });
      }
   });

   new Router();
});