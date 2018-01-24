define([
   'Views/FloatArea/FloatArea',
   'jade!Views/FloatMenu/FloatMenu'
], function(FloatArea, template) {
   'use strict';
   
   return FloatArea.extend({
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
       * Нужно ли добавлять тень
       * @config {Boolean}
       */
      shadow: true,

      /**
       * Обратчики представления
       * @return {Object}
       */
      events: function() {
         return {
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
         options.$el = this.render(options);
         return FloatArea.prototype.initialize.apply(this, arguments);
      },

      /**
       * Рендер
       * @param {Object} options
       * @param {Array.<Object>} options.items
       * @param {Function} templateItem
       */
      render: function(options) {
         this.items = options.items instanceof Array
            ? options.items
            : this.items;

         this.templateItem = options.templateItem instanceof Function
            ? options.templateItem
            : this.templateItem;

         var $el = $(template({
            items: this.items,
            templateItem: this.templateItem
         }));

         $el.attr({
            'data-shadow': !!(options.shadow !== undefined ? options.shadow : this.shadow)
         });

         return $el;
      }
   })
});