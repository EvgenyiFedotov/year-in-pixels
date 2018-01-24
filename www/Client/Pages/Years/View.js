define([
   'Pages/Years/Views/Palette/Palette',
   'Pages/Years/Views/MenuOptions/MenuOptions',
   'Pages/Years/Views/Settings/Settings',
   'Core/Service',
   'Pages/Years/Helpers'
], function(Palette, MenuOptions, Settings, Service, Helpers) {
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
         // Клик в любую область представления
         'click': '_click',

         // Клик по блоку дня
         'click .table .block-color': '_clickBlockColor',

         // Клик по кнопке с палеткой
         'click .button[name="palette"]': '_clickButtonPalette',

         // Клик по кнопке с опциями
         'click .button[name="options"]': '_clickButtonOptions'
      },

      initialize: function() {
         // Палетка для блоков дней
         this.daysPalette = new Palette({
            $border: $('.content .table'),
            offset: {
               top: -12,
               left: -14
            }
         });

         // Будем слушать события клика по элементу палетки
         this.listenTo(this.daysPalette, 'clickItem', function(data) {
            var date = this.daysPalette.date;

            // Отправим данные на сервер
            Service.post('Days.Write', {
               date: date,
               status: data.status
            }, {
               success: function(result) {
                  this.colorDay(date, data.color);
               }.bind(this)
            });
         });

         // Палетка для кнопкии "палетка"
         this.buttonPalette = new Palette({
            $border: $('body'),
            offset: {
               top: -5,
               left: -5
            }
         });

         // Меню опций
         this.menuOptions = new MenuOptions({
            $target: this.$('.button[name="options"]'),
            $border: $('body')
         });

         // Подпишимся на события клика по меню опций
         this.listenTo(this.menuOptions, 'clickItem', this._clickMenuOptions);

         // Настройки
         this.settings = new Settings({
            $el: this.$('.content-center')
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
       * Обработчик клика в любую область представления
       */
      _click: function() {
         this.daysPalette.hide();
         this.buttonPalette.hide();
         this.menuOptions.hide();
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
       * Обработчик клика по кнопке с опциями
       */
      _clickButtonOptions: function(e) {
         e.stopPropagation();

         this.setBlur(false);
         this.daysPalette.hide();
         this.menuOptions.hide();
         this.menuOptions.show();

         // Запишем в навигацию
         this.navigate('options');
      },

      /**
       * Обработчик клика по меню опций
       */
      _clickMenuOptions: function(data, $item, e) {
         // Настройки
         if (data.name === 'settings') {
            e.stopPropagation();

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