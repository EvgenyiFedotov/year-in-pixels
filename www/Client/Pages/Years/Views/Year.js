define([
   'Pages/Years/Views/Palette',
   'Views/FloatArea/FloatArea',
   'Core/Service',
   'Pages/Years/Helpers'
], function(Palette, FloatArea, Service, Helpers) {
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
         'click .button[name="palette"]': '_clickButtonPalette'
      },

      initialize: function () {
         // Палетка для блоков дней
         this.daysPalette = new Palette();
         this.daysPaletteFloatArea = new FloatArea({
            $el: this.daysPalette.$el,
            $border: $('.content .table'),
            offset: {
               top: -6,
               left: -7
            }
         });

         // Будем слушать события клика по элементу палетки
         this.listenTo(this.daysPalette, 'click', function(data) {
            var date = this.daysPaletteFloatArea.date;

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
         this.buttonPaletteFloatArea = new FloatArea({
            $el: new Palette().$el,
            $border: $('body'),
            offset: {
               top: -5,
               left: -5
            }
         });
      },

      /**
       * Установить размытие контента
       * @param  {Boolean} value
       */
      setBlur: function(value) {
         this.$('.content').attr('data-blur', value + '');
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
         this.daysPaletteFloatArea.hide();
         this.buttonPaletteFloatArea.hide();
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

         this.daysPaletteFloatArea.show($target);
         this.daysPaletteFloatArea.date = date;

         // Скроем палетку для кнопки
         this.buttonPaletteFloatArea.hide();

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

         this.daysPaletteFloatArea.hide();
         this.setBlur(false);
         this.buttonPaletteFloatArea.show($target);

         // Запишем в навигацию
         this.navigate('palette');
      }
   });
});