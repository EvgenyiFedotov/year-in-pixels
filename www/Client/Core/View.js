define(function() {
   'use strict';

   return Backbone.View.extend({
      /**
       * Шаблон
       * @config {Function}
       */
      template: null,

      /**
       * @param {Object} options
       * @param {Function} [options.template]
       * @param {Boolean} [options.firstRender]
       */
      initialize: function(options) {
         options = options instanceof Object ? options : {};

         // Темлейт
         this.template = options.template || this.template;

         // Произведем рендер, если это необходимо
         if (options.firstRender !== false) {
            this.render(options);
         }
      },

      /**
       * Рендер
       * @param {Object} [params]
       */
      render: function(params) {
         if (this.template) {
            this.$el.html(this.template(params || {}));
         }

         return this;
      }
   });
});