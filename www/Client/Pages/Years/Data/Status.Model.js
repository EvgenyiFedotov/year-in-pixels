define([
   'Core/Model'
],function(Model) {
   'use strict';

   return Model.extend({
      /**
       * @config {String}
       */
      object: 'Statuses',

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
         note: '',

         /**
          * Удален ли статус
          * @config {Boolean}
          */
         is_delete: false,

         /**
          * Стиль маркера
          * @config {String}
          */
         styleMarker: ''
      },

      initialize: function() {
         this.on('change:color', function(model, value) {
            model.set('styleMarker', this.styleMarker(value, true));
         });
      },

      /**
       * @param {Object}
       */
      parse: function(params) {
         params.styleMarker = this.styleMarker(params.color, true);
         params.is_delete = params.is_delete === false || params.is_delete === '1';
         return params;
      },

      /**
       * Получить стиль маркера
       * @param {String} color
       * @param {Boolean} isString
       */
      styleMarker: function(color, isString) {
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
      },

      /**
       * Аттрибуты для верстки
       */
      attrs: function() {
         return {
            'data-id': this.id
         };
      }
   });
});