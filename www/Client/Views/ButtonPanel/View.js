define([
   'Views/FloatArea/FloatArea'
], function(FloatArea) {
   'use strict';

   return Backbone.View.extend({
      /**
       * Представление всплывающей панели
       * @config {Views/FloatMenu}
       */
      _floatArea: FloatArea,

      /**
       * Опции для создания всплывающей панели
       * @config {Object}
       */
      _panel: null,

      /**
       * Инстанс всплывающей панели
       * @config {Views/FloatMenu}
       */
      panel: null,

      /**
       * @config {Object}
       */
      events: {
         'click': 'click'
      },

      /**
       * @param {Object} options
       * @param {Object} options.panel
       */
      initialize: function(options) {
         // Настроки всплывающей панели
         if (options.panel instanceof Object) {
            options.panel.$target = options.$el || this.$el;
            this._panel = options.panel;
         }
      },

      /**
       * Создать всплывающую панель
       */
      createPanel: function() {
         /**
          * Создадим всплывающую панель, если не еще создали
          * и если есть настройки для него
          */
         if (!this.panel && this._panel) {
            this.panel = new this._floatArea(this._panel);

            this.trigger('createPanel', this.panel);

            this.listenTo(this.panel, 'show', function() {
               this.trigger('show');
            });

            this.listenTo(this.panel, 'hide', function() {
               this.trigger('hide');
            });
         }

         return this.panel;
      },

      /**
       * Клик по кнопке
       */
      click: function(e) {
         var panel = this.createPanel();

         e.stopPropagation();

         if (panel) {
            panel.show();
         }

         this.trigger('click', e);
      }
   });
});