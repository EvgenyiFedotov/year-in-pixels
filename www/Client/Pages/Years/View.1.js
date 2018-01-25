define([
   'Pages/Years/Views/Palette/Palette',
   'Pages/Years/Views/MenuOptions/MenuOptions',
   'Pages/Years/Views/Settings/Settings',
   'Views/ButtonPanel/View',
   'Core/Service',
   'Pages/Years/Helpers'
], function(Palette, MenuOptions, Settings, ButtonPanel, Service, Helpers) {
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
         // 'click .table .block-color': '_clickBlockColor',

         // // Клик по кнопке с палеткой
         // 'click .button[name="palette"]': '_clickButtonPalette',

         // // Клик по кнопке с меню
         // 'click .button[name="menu"]': '_showMenu'
      },

      initialize: function() {
         // Палетка для блоков дней
         // this.daysPalette = new Palette({
         //    $border: $('.content .table'),
         //    offset: {
         //       top: -12,
         //       left: -14
         //    }
         // });

         this.menu = new ButtonPanel({
            el: this.$('.button[name="menu"]'),
            panel: {
               $el: this.daysPalette.$el
            }
         });

         // // Будем слушать события клика по элементу палетки
         // this.listenTo(this.daysPalette, 'clickItem', function(data) {
         //    var date = this.daysPalette.date;

         //    // Отправим данные на сервер
         //    Service.post('Days.Write', {
         //       date: date,
         //       status: data.status
         //    }, {
         //       success: function(result) {
         //          this.colorDay(date, data.color);
         //       }.bind(this)
         //    });

         //    this.daysPalette.hide();
         // });

         // this.listenTo(this.daysPalette, 'hide', this.hidePaletteDays);

         // // Палетка для кнопкии "палетка"
         // this.buttonPalette = new Palette({
         //    $border: $('body'),
         //    offset: {
         //       top: -5,
         //       left: -5
         //    }
         // });

         // // Меню опций
         // this.menuOptions = new MenuOptions({
         //    $target: this.$('.button[name="menu"]'),
         //    $border: $('body')
         // });

         // // Подпишимся на события клика по меню опций
         // this.listenTo(this.menuOptions, 'clickItem', this._clickMenuOptions);
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