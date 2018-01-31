define([
   'Views/ButtonMenu/View',
   'Views/Menu/View',
   'Views/FloatArea/View',
   'Pages/Years/FormEditDay/View',
   'Pages/Years/Palette/Items',
   'jade!Pages/Years/Palette/Item',
   'Pages/Years/Settings/View',
   'Core/Service',
   'Pages/Years/Helpers',
   'css!Pages/Years/Palette/Style'
], function(ButtonMenu, Menu, FloatArea, FormEditDay, PaletteItems, tPaletteItem, Settings, Service, Helpers) {
   'use strict';

   // Данные пользователя
   var user;
   if (window.user) {
      user = new Backbone.Model(window.user);
      delete window.user;
   }

   return Backbone.View.extend({
      /**
       * @config {Backbone.Router}
       */
      router: null,

      /**FormEditDay
       * @config {Object}
       */
      events: {
         // Клик по блоку дня
         'click .days .day-marker': '_clickDay'
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
            var paletteItems = PaletteItems();

            // Добавим кнопку редактирования
            paletteItems.unshift({
               content: 'Edit',
               template: false
            });

            // Создадим меню
            var menu = new Menu({
               className: 'palette',
               templateItem: tPaletteItem,
               items: paletteItems
            });

            // Подписка на события меню
            this.listenTo(menu, 'clickItem', function(data) {
               var date = this.palette.date;

               // Если выбрали статус
               if (data.status !== undefined) {
                  // Отправим данные на сервер
                  Service.post('Days.Write', {
                     date: date,
                     status: data.status
                  }, {
                     success: function(result) {
                        this.$('.days .day-marker[data-date=' + date + ']')
                           .attr('style', Helpers.styleColorBlock(data.color));
                     }.bind(this)
                  });

               // Если нажали на кнопку редактирования
               } else {
                  this.formEditDay.show(this.palette.$target);
                  console.log('Edit day ', date);
               }

               this.palette.hide();
            });

            // Создадим всплывающую панель с меню
            this.palette = new FloatArea({
               $el: menu.$el,
               $border: $('body')
            });

            // Подписка на события панели
            this.listenTo(this.palette, 'hide', function() {
               $content.attr('data-blur', 'false');
               this.navigate(null);
            });

            this.listenTo(this.palette, 'show', function() {
               this.menu && this.menu.hide();
               this.buttonPalette && this.buttonPalette.hide();
               this.formEditDay && this.formEditDay.hide();
               this.navigate('date=' + this.palette.date);
               $content.attr('data-blur', 'true');
            });

            // Создадим форму редактирования дня
            var formEditDay = new FormEditDay();

            // Создадим всплывающую панель редактирования дня
            this.formEditDay = new FloatArea({
               $el: formEditDay.$el,
               $border: $('body')
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
            this.palette.hide();
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
               el: this.$('.content-center'),
               model: user
            });

            // Слушать событие закрытия панели с опциями
            this.listenTo(this.settings, 'close', function() {
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
      },

      /**
       * Отобразить меню
       */
      showMenu: function() {
         this.createMenu();

         if (this.menu) {
            this.menu.show();
         }
      }
   });
});