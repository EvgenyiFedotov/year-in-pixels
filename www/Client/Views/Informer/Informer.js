define([
   'jade!Views/Informer/Informer',
   'css!Views/Informer/Informer'
], function(template) {
   'use strict';

   var $body = $('body');

   var count = 0;
   var heightAllInformers = 0;

   var informers = function() {
      return $body.find('.informer[destroy!="true"]');
   };

   var heightInformer = function($informer) {
      var rows = parseInt($informer.attr('rows'));

      if (rows === 1) {
         return 3;
      } else if (rows === 2) {
         return 5;
      } else {
         return 3;
      }
   };

   /**
    * Установить корректный отступ для информера
    * @param $informer
    * @param {Number} index
    * @param {Number} height
    */
   // var informerBottom = function($informer, index, height) {
   // $informer.css('bottom', index * height + (index + 1) + 'rem');
   var informerBottom = function($informer, height) {
      var bottom = 0;

      informers().each(function(index, el) {
         bottom += heightInformer($(el)) + 1;
      });

      bottom -= heightInformer($informer);

      $informer.css('bottom', bottom + 'rem');
   };

   /**
    * Удалить информер
    */
   var informerRemove = function($informer, height) {
      console.log($informer);

      var bottom = heightInformer($informer) + 1;

      $informer.css('bottom', -bottom + 'rem');

      // informerBottom($informer, -1, height);
      // $informer.attr('destroy', true);
      // count--;

      // setTimeout(function() {
      //    $informer.remove();
      // }, 600);
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
      height: 3,

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
         var header = options.header !== undefined ? options.header : '';
         var note = options.note !== undefined ? options.note : '';

         this.$el = $(template({
            rows: header && note ? 2 : 1,
            header: header,
            note: note
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

      show: function() {
         setTimeout(function() {
            var height = this.height;

            // Если количество информеров больше максимального значения
            if (count + 1 > this.maxCount) {
               var $informers = informers();

               // $informers.each(function(index, el) {
               //    informerBottom($(el), index - 1, height);
               // });
               // $informers.eq(0).remove();
               // count--;
            }

            // Отобразим информер
            informerBottom(this.$el, height);
            // count++;

            // Если необходимо автоматически скрыать информер
            // if (this.autoHide) {
            //    setTimeout(function() {
            //       this.hide();
            //    }.bind(this), this.timeout * 1000);
            // }
         }.bind(this), 0);
      },

      hide: function() {
         var height = this.height;

         // Удалим информер
         informerRemove(this.$el, height);

         // Подвинем остальные информеры
         // this.informers().each(function(index, el) {
         //    informerBottom($(el), index, height);
         // });
      },

      _clickButtonClose: function() {
         this.hide();
      }
   });
});