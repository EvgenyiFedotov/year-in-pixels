define([
   'jade!Pages/Years/Views/Settings/Settings'
], function(template) {
   'use strict';

   return Backbone.View.extend({
      /**
       * @param {Object} options
       */
      initialize: function (options) {
         options.$el.append(this.render(options));
      },

      /**
       * Рендер
       * @param {Object} params
       */
      render: function(params) {
         return template(params || {});
      }
   });
});