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
          * Описание дня
          * @config {String}
          */
         note: '',

         /**
          * Статус идентификатор
          * @config {Number}
          */
         status: null,

         /**
          * Статус цвет
          * @config {String}
          */
         statusColor: null,

         /**
          * Статус тескт
          * @config {String}
          */
         statusText: 'Status'
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
         params.status = parseInt(params.status);

         return params;
      },

      /**
       * Получить стиль для маркера дня
       */
      styleMarkerDay: function() {
         var color = this.get('statusColor');
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
       */
      styleMarkerDayString: function() {
         var style = this.styleMarkerDay();

         return Object.keys(style).reduce(function(result, key) {
            result.push(key + ': ' + style[key]);
            return result;
         }, []).join('; ');
      }
   });
});