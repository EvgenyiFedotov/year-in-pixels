var year;

define([
   'Pages/Years/View',
   'css!Pages/Years/Style'
], function (Year) {
   'use strict';

   year = new Year({
      el: $('body')
   });

   var Router = Backbone.Router.extend({
   });

   year.router = new Router();
});