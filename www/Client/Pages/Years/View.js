define([
   'Views/ButtonMenu/View',
   'Views/Menu/View',
   'Views/FloatArea/View',
   'Pages/Years/Views/Palette/Items',
   'jade!Pages/Years/Views/Palette/Item',
   'Pages/Years/Views/Settings/View',
   'Core/Service',
   'Pages/Years/Helpers',
   'css!Pages/Years/Views/Palette/Style'
], function(ButtonMenu, Menu, FloatArea, PaletteItems, tPaletteItem, Settings, Service, Helpers) {
   'use strict';

   return Backbone.View.extend({
      /**
       * @config {Backbone.Router}
       */
      router: null,

      /**
       * @config {Object}
       */
      events: {
         // Клик по блоку дня
         'click .table .block-color': '_clickDay'
      },

      initialize: function() {
         // Кнопка меню
         this.createMenu();

         // Палетка
         this.createPalette();

         // Палетка для дней
         this.createPaletteDays();
      },

      /**
       * Создать меню (кнопку) (для настроек)
       */
      createMenu: function() {
         if (!this.menu) {
            this.menu = new ButtonMenu({
               el: this.$('.button[name="menu"]'),
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

            this.listenTo(this.menu, 'hide', function() {
               if (window.location.hash !== '#settings') {
                  this.navigate(null);
               }
            });

            this.listenTo(this.menu, 'show', function() {
               this.buttonPalette && this.buttonPalette.hide();
               this.palette && this.palette.hide();
               this.navigate('menu');
            });

            this.listenTo(this.menu, 'clickItem', function(data) {
               // Настройки
               if (data.name === 'settings') {
                  // Создалим панель настроек, если это необходимо и отобразим ее
                  this.showSettings();

                  this.navigate('settings');

               // Выход
               } else if (data.name === 'sign-out') {
                  Service.get('Auth.Singout', {}, {
                     success: function(result) {
                        window.location.reload();
                     }.bind(this)
                  });
               }
            });
         }
      },

      /**
       * Создать палетку
       */
      createPalette: function() {
         if (!this.buttonPalette) {
            this.buttonPalette = new ButtonMenu({
               el: this.$('.button[name="palette"]'),
               menu: {
                  className: 'palette',
                  templateItem: tPaletteItem,
                  items: PaletteItems()
               }
            });

            this.listenTo(this.buttonPalette, 'hide', function() {
               this.navigate(null);
            });

            this.listenTo(this.buttonPalette, 'show', function() {
               this.menu && this.menu.hide();
               this.palette && this.palette.hide();
               this.navigate('palette');
            });
         }
      },

      /**
       * Создать палетку для дней
       */
      createPaletteDays: function() {
         if (!this.palette) {
            var $content = this.$el.children('.content');
            var menu = new Menu({
               className: 'palette',
               templateItem: tPaletteItem,
               items: PaletteItems()
            });

            this.listenTo(menu, 'clickItem', function(data) {
               var date = this.palette.date;

               // Отправим данные на сервер
               Service.post('Days.Write', {
                  date: date,
                  status: data.status
               }, {
                  success: function(result) {
                     this.$('.content .table .block-color[data-date=' + date + ']')
                        .attr('style', Helpers.styleColorBlock(data.color));
                  }.bind(this)
               });

               this.palette.hide();
            });

            this.palette = new FloatArea({
               $el: menu.$el
            });

            this.listenTo(this.palette, 'hide', function() {
               $content.attr('data-blur', 'false');
               this.navigate(null);
            });

            this.listenTo(this.palette, 'show', function() {
               this.menu && this.menu.hide();
               this.buttonPalette && this.buttonPalette.hide();
               this.navigate('date=' + this.palette.date);
               $content.attr('data-blur', 'true');
            });
         }
      },

      /**
       * Клик по блоку дня
       */
      _clickDay: function(e) {
         if (this.palette) {
            var $target = $(e.target);

            e.stopPropagation();

            this.palette.date = $target.data().date;
            this.palette.show($target);
         }
      },

      /**
       * Записать url
       * @param {String} url
       * @param {Object} [options]
       */
      navigate: function(url, options) {
         if (this.router) {
            this.router.navigate(url, options);
         }
      },

      /**
       * Создать и отобразить настройки
       */
      showSettings: function() {
         var $table = this.$('.content-center>.table');

         // Если еще не создали панель настроек
         if (!this.settings) {
            this.settings = new Settings({
               el: this.$('.content-center')
            });

            // Слушать событие закрытия панели с опциями
            this.listenTo(this.settings, 'hide', function() {
               this.navigate(null);
               $table.attr('data-show', 'true');
            });
         }

         // Скроем таблицу с днями
         $table.attr('data-show', 'false');

         // Отобразим панель
         this.settings.show();

         // Запишем в навигацию
         this.navigate('settings');
      }
   });
});