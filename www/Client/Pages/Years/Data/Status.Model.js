define(function() {
   'use strict';

   return Backbone.Model.extend({
      /**
       * @config {Object}
       */
      defaults: {
         /**
          * Цвет
          * @config {String}
          */
         color: null,

         /**
          * Описание
          * @config {String}
          */
         note: null
      }
   });
});