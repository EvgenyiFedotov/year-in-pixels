define([
   'Pages/Years/Data/statuses'
], function(statuses) {
   'use strict';

   console.log(statuses);

   return Backbone.Model.extend({
      /**
       * @config {function}
       */
      defaults: {
         /**
          * Дата
          * @config {Date}
          */
         date: new Date(),

         /**
          * Описание дня
          * @config {String}
          */
         note: '',

         /**
          * Статус идентификатор
          * @config {Number}
          */
         status_id: null
      },

      /**
       * Парсинг сырых данных
       * @param {Object} params
       */
      parse: function(params) {
         // Дата
         if (typeof params.date === 'string') {
            params.date = new Date(params.date);
         }

         // Статус
         params.status_id = parseInt(params.status_id);

         return params;
      },

      /**
       * Получит модель статуса
       * @return {Status.Model}
       */
      status: function() {
         return statuses.get(this.get('status_id'));
      }
   });
});