define([
   'Pages/Years/Data/Day.Model'
], function(Model) {
   'use strict';

   var Days = Backbone.Collection.extend({
      model: Model
   });

   return new Days(window.days, {
      parse: true
   });
});