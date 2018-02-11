define([
   'Pages/Years/Data/Day.Model'
], function(Model) {
   'use strict';

   return Backbone.Collection.extend({
      model: Model
   });
});