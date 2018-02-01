define([
   'Pages/Years/Data/Day.Model'
], function(Model) {
   'use strict';

   var Days = Backbone.Collection.extend({
      model: Model
   });

   console.log(window.days);

   return new Days([{}, {}, {}, {}]);
});