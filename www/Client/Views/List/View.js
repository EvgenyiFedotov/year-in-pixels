define([
   'jade!Views/List/Template'
], function(template) {
   'use strict';

   return Backbone.View.extend({
      /**
       * Шаблон итема
       * @config {Function}
       */
      templateItem: null,

      /**
       * Массив итемов
       * @config {Array.<Object>}
       */
      items: [],

      /**
       * Обратчики представления
       * @return {Object}
       */
      events: function() {
         return {
            /**
             * Клик по итему списка
             */
            'click .item': function(e) {
               var $item = $(e.target).closest('.item');

               this.trigger('clickItem', $item.data(), $item, e);
            }
         };
      },

      /**
       * @param {Object} options
       */
      initialize: function (options) {
         // Установим класс
         this.$el.addClass('list');
         // Рендер списка
         this.$el.html(this.render(options));

         Backbone.View.prototype.initialize.apply(this, arguments);
      },

      /**
       * Рендер
       * @param {Object} options
       * @param {Array.<Object>} [options.items]
       * @param {Function} [options.templateItem]
       */
      render: function(options) {
         options = options instanceof Object ? options : {};

         this.items = options.items instanceof Array
            ? options.items
            : this.items;

         this.templateItem = options.templateItem instanceof Function
            ? options.templateItem
            : this.templateItem;

         return $(template({
            items: this.items,
            templateItem: this.templateItem
         }));
      }
   });
});