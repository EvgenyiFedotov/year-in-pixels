define(function() {
   'use strict';

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
          * Статус
          * @config {Object}
          */
         status: {
            color: null,
            text: 'Status'
         },

         /**
          * Описание дня
          * @config {String}
          */
         note: ''
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

         return params;
      },

      /**
       * Получить стиль для маркера дня по объекту статуса
       * @param {Object} status
       */
      styleMarkerDay: function(status) {
         var color = status.color;
         var style = {};

         if (color) {
            _.defaults(style, {
               'border': '1px solid ' + color,
               'background-color': color
            });
         }

         return style;
      },

      /**
       * Получить стиль для маркера дня по объекту статуса в виде строки
       * @param {Object} status
       */
      styleMarkerDayString: function(status) {
         var style = this.styleMarkerDay(status);

         return Object.keys(style).reduce(function(result, key) {
            result.push(key + ': ' + style[key]);
            return result;
         }, []).join('; ');
      }
   });
});