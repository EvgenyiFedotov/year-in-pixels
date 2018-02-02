define([
   'Core/View',
   'jade!Pages/Years/Navigation/Template',
   'css!Pages/Years/Navigation/Style'
], function(View, template, ButtonMenu) {
   'use strict';
   
   return View.extend({
      className: 'navigation',
      template: template,

      /**
       * Селекторы
       * @config {Object}
       */
      selectors: {
         // Кнопка меню
         'buttonMenu': '.button[data-name="menu"]'
      },

      /**
       * @config {Function}
       * @return {Object}
       */
      events: function() {
         var events = {};

         events['click ' + this.selector('buttonMenu')] = 'showMenu';

         return events;
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         View.prototype.initialize.apply(this, arguments);
      },

      /**
       * Создать меню
       * @param {Function} callback
       */
      createMenu: function(callback) {
         if (!this.menu) {
            requirejs(['Views/ButtonMenu/View'], function(ButtonMenu) {
               this.menu = new ButtonMenu({
                  el: this.selector('buttonMenu'),
                  panel: {
                     $border: $('body'),
                     className: 'menu-settings'
                  },
                  menu: {
                     items: [
                        {
                           content: 'Settings',
                           attrs: {'data-name': 'settings'}
                        }, {
                           content: 'Sign out',
                           attrs: {'data-name': 'sign-out'}
                        }
                     ]
                  }
               });

               this.trigger('createMenu');

               if (callback instanceof Function) {
                  callback.call(this, this.menu);
               }
            }.bind(this));
         }
      },

      /**
       * Показать меню
       */
      showMenu: function() {
         this.createMenu(function(menu) {
            menu.show();
         });

         if (this.menu) {
            this.menu.show();
         }
      }
   });
});