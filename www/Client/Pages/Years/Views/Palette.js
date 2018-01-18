define([
   'jade!Pages/Years/Templates/Palette',
   'Pages/Years/Helpers',
   'css!Pages/Years/Styles/Palette'
], function(tPalette, Helpers) {
   'use strict';

   var palette = tPalette({
      palette: window.palette,
      style: Helpers.styleColorBlock
   });

   // Очистим глобальную переменную
   if (window.palette) {
      delete window.palette;
   }

   return Backbone.View.extend({
      /**
       * @config {Object}
       */
      events: {
         'click .palette-item': function(e) {
            var data = $(e.target).closest('.palette-item').data();
            this.trigger('click', data);
         }
      },

      initialize: function () {
         this.$el = $(palette);
      }
   });
});