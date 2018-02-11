var year;

define([
   'Pages/Years'
], function (Year) {
   'use strict';

   year = new Year({
      el: $('body')
   });

   var Router = Backbone.Router.extend({
      routes: {
         'settings': 'settings'
      },

      /**
       * Открыть сразу настройки
       */
      settings: function() {
         year.showSettings();
      }
   });

   year.router = new Router();
});