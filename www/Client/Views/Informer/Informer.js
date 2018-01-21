define([
   'jade!Views/Informer/Informer',
   'css!Views/Informer/Informer'
], function(template) {
   'use strict';

   var $body = $('body');

   var count = 0;

   /**
    * Установить корректный отступ для информера
    * @param $informer
    * @param {Number} index
    * @param {Number} height
    */
   var informerBottom = function($informer, index, height) {
      $informer.css('bottom', index * height + (index + 1) + 'rem');
   };

   /**
    * Удалить информер
    */
   var informerRemove = function($informer, height) {
      informerBottom($informer, -1, height);
      $informer.attr('destroy', true);
      count--;

      setTimeout(function() {
         $informer.remove();
      }, 600);
   };

   return Backbone.View.extend({
      /**
       * @config {String}
       */
      type: '',

      /**
       * Высота информера
       * @config {Number}
       */
      height: 5,

      /**
       * Автоматически скрывать информер
       * @config {Booleans}
       */
      autoHide: true,

      /**
       * Автоматически скрыать через N секунд
       * @param {Number}
       */
      timeout: 5,

      /**
       * Максимальное количиство информеров
       * @config {Number}
       */
      maxCount: 3,

      events: {
         'click .button[name="close"]': '_clickButtonClose'
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         this.$el = $(template({
            header: options.header !== undefined ? options.header : '',
            note: options.note !== undefined ? options.note : ''
         }));

         $body.append(this.$el);

         this.type = options.type || this.type;
         this.$el.attr('type', this.type);

         this.autoHide = options.autoHide !== undefined
            ? !!options.autoHide
            : this.autoHide;

         this.timeout = options.timeout !== undefined
            ? options.timeout
            : this.timeout;
      },

      informers: function() {
         return $body.find('.informer[destroy!="true"]');
      },

      show: function() {
         setTimeout(function() {
            var height = this.height;

            // Если количество информеров больше максимального значения
            if (count + 1 > this.maxCount) {
               var $informers = this.informers();

               $informers.each(function(index, el) {
                  informerBottom($(el), index - 1, height);
               });
               $informers.eq(0).remove();
               count--;
            }

            // Отобразим информер
            informerBottom(this.$el, count, height);
            count++;

            // Если необходимо автоматически скрыать информер
            if (this.autoHide) {
               setTimeout(function() {
                  this.hide();
               }.bind(this), this.timeout * 1000);
            }
         }.bind(this), 0);
      },

      hide: function() {
         var height = this.height;

         // Удали информер
         informerRemove(this.$el, height);

         // Подвинем остальные информеры
         this.informers().each(function(index, el) {
            informerBottom($(el), index, height);
         });
      },

      _clickButtonClose: function() {
         this.hide();
      }
   });
});