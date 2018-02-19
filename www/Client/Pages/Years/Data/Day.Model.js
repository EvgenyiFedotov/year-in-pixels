define([
   'Core/Model',
   'Pages/Years/Data/StatusesAll'
], function(Model, statusesAll) {
   'use strict';

   return Model.extend({
      /**
       * @config {String}
       */
      object: 'Days',

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
         status_id: null,

         /**
          * Дата в формате SQL
          * @config {String}
          */
         dateSQL: null,

         /**
          * Год (для быстрой фильтрации)
          * @config {Number}
          */
         year: null
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
         params.status_id = params.status_id ? parseInt(params.status_id) : null;

         if (params.date) {
            // Дата SQL
            params.dateSQL = this.dateSQL(params.date);

            // Год
            params.year = params.date.getFullYear();
         }

         return params;
      },

      /**
       * Получит модель статуса
       * @return {Status.Model}
       */
      status: function() {
         return statusesAll.get(this.get('status_id'));
      },

      /**
       * Получить дату в формате SQL
       * @param {Date} date
       * @return {String}
       */
      dateSQL: function(date) {
         return _.isDate(date)
            ? _.map([date.getFullYear(), date.getMonth() + 1, date.getDate()], function(value) {
                  return value < 10 ? ('0' + value) : value;
               }).join('-')
            : null;
      }
   });
});