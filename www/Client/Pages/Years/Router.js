define([
   'Pages/Years/View',
   'css!Pages/Years/Style'
], function (Year) {
   'use strict';

   var year = new Year({
      el: $('body')
   });

   var Router = Backbone.Router.extend({
      routes: {
         'date=:date': 'date',
         'palette': 'palette',
         'menu': 'menu',
         'settings': 'settings'
      },
      date: function(date) {
         year.$('.days .day-marker[data-date="' + date + '"]').click();
      },
      palette: function() {
         year.$('.button[name="palette"]').click();
      },
      menu: function() {
         year.showMenu();
      },
      settings: function() {
         year.showSettings();
      }
   });

   year.router = new Router();
});