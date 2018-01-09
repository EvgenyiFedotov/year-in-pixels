define([
   'Views/FloatArea/FloatArea',
   'jade!Pages/Years/Templates/Palette',

   'css!Pages/Years/Styles/Main',
   'css!Pages/Years/Styles/Palette'
], function (FloatArea, tPalette) {
   'use strict';

   var styleColorBlock = function(color) {
      return [
         ['border: 1px solid ', '; '].join(color),
         ['background: repeating-linear-gradient(-45deg, white, white 5px, ', ' 5px, ', ' 10px);'].join(color)
      ].join('');
   };

   var ViewPalette = Backbone.View.extend({
      /**
       * @config {String}
       */
      date: null,

      /**
       * @config {jQuery}
       */
      el: $(tPalette({
         palette: window.palette,
         style: styleColorBlock
      })),

      /**
       * @config {Object}
       */
      events: {
         'click .palette-item': function(e) {
            this.trigger('click', this.date, $(e.target).closest('.palette-item').data());
         }
      }
   });

   var vPalette = new ViewPalette();

   /**
    * Экземпляр пелетки с цветами
    */
   var floatArea = new FloatArea({
      $el: vPalette.$el,
      $border: $('.content .table')
   });

   var Years = Backbone.View.extend({
      /**
       * @config {jQuery}
       */
      el: $('body'),

      /**
       * @config {Object}
       */
      events: {
         'click .table .block-color': function(e) {
            e.stopPropagation();

            var $target = $(e.target);

            floatArea.show($target);
            vPalette.date = $target.data().date;

            this.setBlur(true);
         },

         'click': function() {
            floatArea.hide();
            this.setBlur(false);
         }
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
            .attr('style', styleColorBlock(color));
      }
   });

   var years = new Years();

   years.listenTo(vPalette, 'click', function (date, data) {
      this.colorDay(date, data.color);
   });

   if (window.palette) {
      delete window.palette;
   }
});