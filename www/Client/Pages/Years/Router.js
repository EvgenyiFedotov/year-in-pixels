define([
   'Pages/Years/Views/Year',
   'css!Pages/Years/Styles/Main'
], function (Year) {
   'use strict';

   var year = new Year({
      el: $('body')
   });

   var Router = Backbone.Router.extend({
      routes: {
         'date=:date': 'date',
         'palette': 'palette'
      },
      date: function(date) {
         year.$('.block-color[data-date="' + date + '"]').click();
      },
      palette: function() {
         year.$('.button[name="palette"]').click();
      }
   });

   year.router = new Router();
});