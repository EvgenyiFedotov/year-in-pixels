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
         note: 'Status'
      },

      /**
       * Получить стиль маркера
       * @param {Boolean} isString
       */
      styleMarker: function(isString) {
         var color = this.get('color');
         var style = {};

         if (color) {
            _.defaults(style, {
               'border': '1px solid ' + color,
               'background-color': color
            });
         }

         // Если необходимо вывести строкой
         if (isString) {
            style = Object.keys(style).reduce(function(result, key) {
               result.push(key + ': ' + style[key]);
               return result;
            }, []).join('; ');
         }

         return style;
      }
   });
});