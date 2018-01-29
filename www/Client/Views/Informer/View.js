define([
   'jade!Views/Informer/Template',
   'theme!css!Views/Informer'
], function(template) {
   'use strict';

   var $body = $('body');

   return Backbone.View.extend({
      /**
       * @config {String}
       */
      type: '',

      /**
       * Автоматически разрушать информер
       * @config {Boolean}
       */
      autoDestroy: true,

      /**
       * Автоматически скрывать информер
       * Внимание! autoDestroy имеет больший приоритет
       * @config {Boolean}
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
         'click .button[name="close"]': 'hide'
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
         this.$el.attr({
            'type': this.type,
            'show': false
         });

         this.autoDestroy = options.autoDestroy !== undefined
            ? !!options.autoDestroy
            : this.autoDestroy;

         this.autoHide = options.autoHide !== undefined
            ? !!options.autoHide
            : this.autoHide;

         this.timeout = options.timeout !== undefined
            ? options.timeout
            : this.timeout;

         this.maxCount = options.maxCount !== undefined
            ? options.maxCount
            : this.maxCount;
      },

      /**
       * Получить информеры
       * @param {Boolean} isVisible
       */
      informers: function(isVisible) {
         var showHide = '';

         if (isVisible !== undefined) {
            showHide = '[show="' + !!isVisible + '"]';
         }

         return $body.find('.informer[destroy!="true"]' + showHide);
      },

      /**
       * Получить высоту информера
       * @param $informer
       */
      _height: function($informer) {
         var rows = parseInt($informer.attr('rows'));
   
         if (rows === 1) {
            return 3;
         } else if (rows === 2) {
            return 5;
         } else {
            return 3;
         }
      },

      _showEl: function($el, bottom) {
         $el.css('bottom', bottom + 'rem');
         $el.attr('show', true);
      },

      show: function() {
         setTimeout(function() {
            var informers = this.informers(true);
            var bottom = 1;

            // Посчитатем отступ для информера
            informers.each(function(index, el) {
               bottom += this._height($(el)) + 1;
            }.bind(this));

            // Выведем информер
            this._showEl(this.$el, bottom);

            // Если количество информеров больше максимального значения
            if (informers.length + 1 > this.maxCount) {
               this._hideEl(informers.eq(0));
               this._calcBottomShowInformers();
            }

            this.trigger('show');

            // Если необходимо автоматически разрушить информер
            if (this.autoDestroy) {
               setTimeout(function() {
                  this.destroy();
               }.bind(this), this.timeout * 1000);

            // Если необходимо автоматически скрывать информер
            } else if (this.autoHide) {
               setTimeout(function() {
                  this.hide();
               }.bind(this), this.timeout * 1000);
            }
         }.bind(this), 0);

         return this;
      },

      _hideEl: function($el) {
         $el.css('bottom', -(this._height($el) + 1) + 'rem');
         $el.attr('show', false);
      },

      /**
       * Рассчитать bottom для всех видимых информеров
       */
      _calcBottomShowInformers: function() {
         var bottom = 1;

         this.informers(true).each(function(index, el) {
            var $el = $(el);

            this._showEl($el, bottom);

            bottom += this._height($el) + 1;
         }.bind(this));
      },

      hide: function() {
         this.trigger('hide');
         this._hideEl(this.$el);
         this._calcBottomShowInformers();
         return this;
      },

      destroy: function() {
         this.trigger('destroy');

         this.hide();

         setTimeout(function() {
            this.$el.remove();
         }.bind(this), 500);
      }
   });
});