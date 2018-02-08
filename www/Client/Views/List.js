define([
   'Core/View',
   'jade!Views/List/Template',
   'jade!Views/List/ListItem'
], function(View, template, tListItem) {
   'use strict';

   return View.extend({
      className: 'list',
      template: template,

      /**
       * Классы для итема
       * @config {String}
       */
      classNameItem: '',

      /**
       * Шаблон итема
       * @config {Function}
       */
      templateItem: null,

      /**
       * Массив итемов
       * @config {Backbone.Collection}
       */
      items: null,

      /**
       * Обратчики представления
       */
      events: {
         // Клик по итему
         'click .item': '_clickItem'
      },

      /**
       * Обработчик инициализации
       * @param {Object} options
       */
      _init: function(options) {
         var itemsIsCollection = options.items instanceof Backbone.Collection;

         // Классы для итемов
         this.classNameItem = options.classNameItem || '';

         // Итемы
         if (_.isArray(options.items) || itemsIsCollection) {
            this.items = options.items;
         } else {
            this.items = [];
         }

         // Если передали коллекцию, оформим корректные подписки
         if (itemsIsCollection) {
            this.listenTo(this.items, 'add', this._addItem);
         }

         // Шаблон итема
         if (_.isFunction(options.templateItem)) {
            this.templateItem = options.templateItem;
         }
      },

      /**
       * Рендер
       * @param {Object} options
       * @param {Array.<Object>} [options.items]
       * @param {Function} [options.templateItem]
       */
      _beforeRender: function(options) {
         options.classNameItem = this.classNameItem;
         options.templateItem = this.templateItem;

         if (this.items instanceof Backbone.Collection) {
            options.items = this.items.models;
         } else {
            options.items = this.items;
         }
      },

      /**
       * Обработчик клика по итему
       */
      _clickItem: function(e) {
         var $item = $(e.target).closest('.item');
         this.trigger('clickItem', $item.data(), $item, e);
      },

      /**
       * Обрботчик добавления итема в коллекцию
       * @param {Backbone.Model} model
       * @param {Backbone.Collection} collection
       */
      _addItem: function(model, collection) {
         var index = collection.indexOf(model);
         var item = tListItem({
            item: model,
            index: index,
            params: {
               classNameItem: this.classNameItem,
               templateItem: this.templateItem
            }
         });

         if (index === 0) {
            this.$el.append(item);
         } else {
            this.$('.item').eq(index - 1).after(item);
         }
      }
   });
});