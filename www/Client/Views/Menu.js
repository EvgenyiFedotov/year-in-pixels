define([
   'Views/List'
], function(List) {
   'use strict';

   return List.extend({
      /**
       * @param {Object} options
       */
      initialize: function (options) {
         // Установим класс
         this.$el.addClass('menu');

         List.prototype.initialize.apply(this, arguments);
      }
   });
});