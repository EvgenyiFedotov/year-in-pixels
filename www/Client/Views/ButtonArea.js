define([
   'Core/View'
], function(View) {
   'use strict';

   return View.extend({
      /**
       * Настройки всплывающей панели
       * @config {Object}
       */
      _floatArea: null,

      /**
       * Дочерние представления
       * @config {Object}
       */
      _childs: {
         floatArea: {
            include: ['Views/FloatArea'],
            callback: function(FloatArea) {
               var floatArea;

               if (_.isObject(this._floatArea)) {
                  floatArea = new FloatArea(this._floatArea);

                  this.listenTo(floatArea, 'show', function() {
                     this.trigger('showArea');
                  });

                  this.listenTo(floatArea, 'hide', function() {
                     this.trigger('hideArea');
                  });
               }

               return floatArea;
            }
         }
      },

      /**
       * Обработчики событий
       * @config {Object}
       */
      events: {'click': '_click'},

      /**
       * @param {Object} options
       * @param {Object} options.floatArea
       */
      _init: function(options) {
         // Всплывающая панель
         if (_.isObject(options.floatArea)) {
            this._floatArea = _.defaults({}, options.floatArea || this.floatArea);

            // Укажем таргет
            this._floatArea.target = this.$el;
         }
      },

      /**
       * Клик по кнопке
       */
      _click: function(e) {
         this.showArea();
         this.trigger('click', e);
      },

      /**
       * Показать всплывающую панель
       */
      showArea: function() {
         this.child('floatArea', function(floatArea) {
            floatArea.show();
         });
      },

      /**
       * Скрыть всплывающую панель
       */
      hideArea: function() {
         this.child('floatArea', function(floatArea) {
            floatArea.hide();
         });
      }
   });
});