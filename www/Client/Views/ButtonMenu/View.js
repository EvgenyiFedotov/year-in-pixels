define([
   'Views/ButtonPanel/View',
   'Views/Menu/View'
], function(ButtonPanel, Menu) {
   'use strict';
   
   return ButtonPanel.extend({
      /**
       * Автоматически скрывать панель, при клике на итем меню
       * @config {Boolean}
       */
      autoHide: true,

      /**
       * Настройки меню
       * @config {Object}
       */
      _menu: null,

      /**
       * Меню
       * @config {Views/Menu}
       */
      menu: null,

      /**
       * @param {Object} options
       * @param {Object} options.menu
       */
      initialize: function (options) {
         options.panel = !options.panel ? {} : options.panel;

         this.autoHide = options.autoHide !== undefined ? !!options.autoHide : true;

         // Настроки меню
         if (options.menu instanceof Object) {
            this._menu = options.menu;
         }

         ButtonPanel.prototype.initialize.apply(this, arguments);
      },

      /**
       * Создать всплывающую панель
       */
      createPanel: function() {
         /**
          * Создадим всплывающую меню, если не еще создали
          */
         if (!this.menu && this._menu) {
            this.menu = new Menu(this._menu);
            this._panel.$el = this.menu.$el;

            this.listenTo(this.menu, 'clickItem', function(data, $item, e) {
               this.trigger('clickItem', data, $item, e);

               // Если установили автоматическое скрытие панели
               if (this.autoHide === true) {
                  this.hide();
               }
            });
         }

         return ButtonPanel.prototype.createPanel.apply(this, arguments);
      }
   });
});