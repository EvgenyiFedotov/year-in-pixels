define([
   'Core/View',
   'jade!Pages/Years/Settings/Template'
], function(View, template) {
   'use strict';

   return View.extend({
      className: 'settings',
      template: template,
      model: new Backbone.Model(window.user),

      selectors: {
         close: '.button[data-name="close"]'
      },

      events: function() {
         var events = {};

         events['click ' + this.selector('close')] = 'close';

         return events;
      },

      /**
       * Скрыть / закрыть окно
       */
      close: function() {
         this.dataShow(false);
      }
   });
});