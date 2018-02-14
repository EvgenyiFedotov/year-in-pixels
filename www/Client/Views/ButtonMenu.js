define([
   'Core/View'
], function(View) {
   'use strict';

   return View.extend({
      /**
       * Конфигурация меню
       * @config {Object}
       */
      _menu: null,

      /**
       * Дочерние представления
       * @config {Object}
       */
      _childs: {
         /**
          * Меню
          */
         menu: {
            include: ['Views/Menu'],
            callback: function(Menu) {
               var menu;

               if (_.isObject(this._menu)) {
                  menu = new Menu(this._menu);
               }

               return menu;
            },
            events: {
               'clickItem': function() {
                  var args = Array.prototype.slice.call(arguments);

                  args.unshift('clickItem');

                  this.trigger.apply(this, args);
               }
            }
         },

         /**
          * Кнопка со всплывающей панелью
          */
         buttonArea: {
            include: ['Views/ButtonArea'],
            callback: function(ButtonArea, callback) {
               this.child('menu', function(menu) {
                  var buttonArea = new ButtonArea({
                     el: this.$el,
                     className: this.className,
                     floatArea: {
                        area: menu.$el
                     }
                  });

                  callback(buttonArea);
               });
            },
            events: {
               'showArea': function() {
                  this.trigger('showMenu');
               },
               'hideArea': function() {
                  this.trigger('hideMenu');
               }
            }
         }
      },

      /**
       * @param {Object} options
       * @param {Object} options.menu
       */
      _init: function(options) {
         // Настройки меню
         if (_.isObject(options.menu)) {
            this._menu = _.defaults({}, options.menu || this.menu);
         }

         // Создадим кнопку
         this.child('buttonArea');
      },

      /**
       * Показать меню
       */
      showMenu: function() {
         this.child('buttonArea', function(button) {
            button.showArea();
         });
      },

      /**
       * Показать меню
       */
      hideMenu: function() {
         this.child('buttonArea', function(button) {
            button.hideArea();
         });
      }
   });
});