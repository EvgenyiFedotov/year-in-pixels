define([
   'Views/ButtonPanel/View',
   'Views/List/View',
   'Core/Service',
   'Pages/Years/Helpers'
], function(ButtonPanel, List, Service, Helpers) {
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
      },

      initialize: function() {
         var menu = new List({
            className: 'main-menu',
            items: [
               {
                  content: 'Settings',
                  attrs: {
                     'data-name': 'settings'
                  }
               }, {
                  content: 'Sign out',
                  attrs: {
                     'data-name': 'sign-out'
                  }
               }
            ]
         });

         // Кнопка меню
         this.menu = new ButtonPanel({
            el: this.$('.button[name="menu"]'),
            panel: {
               $el: menu.$el
            }
         });
      },

      /**
       * Установить размытие контента
       * @param  {Boolean} value
       */
      setBlur: function(value) {
         this.$el.children('.content').attr('data-blur', value + '');
      },

      /**
       * Установить цвет для определенной даты (дня)
       * @param  {String} date
       * @param  {String} color
       */
      colorDay: function(date, color) {
         this.$('.content .table .block-color[data-date=' + date + ']')
            .attr('style', Helpers.styleColorBlock(color));
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
       * Поменять режим отображения таблицы с днями
       * @param {Boolean|String} value
       */
      tableShow: function(value) {
         this.$('.content-center>.table').attr('data-show', value + '');
      },

      /**
       * Обработчик скрытия палетки дней
       */
      hidePaletteDays: function() {
         // Убрать размытие фона
         this.setBlur(false);

         // Запишем в навигацию
         this.navigate(null);
      },

      /**
       * Обработчик клика по блоку дня
       */
      _clickBlockColor: function(e) {
         var $target = $(e.target);
         var date = $target.data().date;

         e.stopPropagation();

         this.daysPalette.show($target);
         this.daysPalette.date = date;

         // Скроем палетку для кнопки
         this.buttonPalette.hide();
         this.menuOptions.hide();

         // Размытие контента
         this.setBlur(true);

         // Запишем в навигацию
         this.navigate('date=' + date);
      },

      /**
       * Обработчик клика по кнопке с палеткой
       */
      _clickButtonPalette: function(e) {
         var $target = $(e.target);

         e.stopPropagation();

         this.daysPalette.hide();
         this.menuOptions.hide();

         this.setBlur(false);

         this.buttonPalette.show($target);

         // Запишем в навигацию
         this.navigate('palette');
      },

      /**
       * Показать меню
       */
      showMenu: function() {
         this.setBlur(false);
         this.daysPalette.hide();
         this.menuOptions.hide();
         this.menuOptions.show();

         // Запишем в навигацию
         this.navigate('menu');
      },

      /**
       * Обработчик клика по кнопке с меню
       */
      _showMenu: function(e) {
         e.stopPropagation();
         this.showMenu();
      },

      /**
       * Создать и отобразить настройки
       */
      showSettings: function() {
         // Если еще не создали панель настроек
         if (!this.settings) {
            this.settings = new Settings({
               el: this.$('.content-center')
            });

            // Слушать событие закрытия панели с опциями
            this.listenTo(this.settings, 'hide', this._hideSettings);
         }

         // Скроем таблицу с днями
         this.tableShow(false);

         // Отобразим панель
         this.settings.show();

         // Запишем в навигацию
         this.navigate('settings');
      },
      
      /**
       * Обработчик закрытия панели настроек
       */
      _hideSettings: function() {
         this.tableShow(true);
      },

      /**
       * Обработчик клика по меню опций
       */
      _clickMenuOptions: function(data, $item, e) {
         // Настройки
         if (data.name === 'settings') {
            e.stopPropagation();

            // Скроем меню опций
            this.menuOptions.hide();

            // Создалим панель настроек, если это необходимо и отобразим ее
            this.showSettings();

         // Выход
         } else if (data.name === 'sign-out') {
            Service.get('Auth.Singout', {}, {
               success: function(result) {
                  window.location.reload();
               }.bind(this)
            });
         }
      }
   });
});