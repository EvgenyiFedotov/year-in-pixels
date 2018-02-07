define(function() {
   'use strict';

   return Backbone.Model.extend({
      /**
       * @config {Object}
       */
      defaults: {
         /**
          * Какому пользователю принадлежит
          * @config {Number}
          */
         userId: null,

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
      },

      /**
       * Парсинг сырых данных
       * @param {Object} params
       */
      parse: function(params) {
         params.userId = parseInt(params.userId);

         return params;
      }
   });
});