define(['Pages/Years/Helpers'], function(Helpers) {
   'use strict';

   return Backbone.View.extend({
      /**
       * @config {Object}
       */
      events: {
         'click .table .block-color': function(e) {
            this.trigger('clickBlockColor', e);
         },

         'click': function(e) {
            this.trigger('click');
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
            .attr('style', Helpers.styleColorBlock(color));
      }
   });
});