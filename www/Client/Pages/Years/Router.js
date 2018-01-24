define([
   'Pages/Years/Views/Year',
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
         'options': 'options'
      },
      date: function(date) {
         year.$('.block-color[data-date="' + date + '"]').click();
      },
      palette: function() {
         year.$('.button[name="palette"]').click();
      },
      options: function() {
         year.$('.button[name="options"]').click();
      }
   });

   year.router = new Router();
});