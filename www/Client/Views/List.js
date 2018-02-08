define([
   'Core/View',
   'jade!Views/List/Template',
   'jade!Views/List/ListItem',
   'theme!css!Views/List/Style'
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
       * Текст, при отсутсвии итемов
       * @config {String}
       */
      nullText: 'The list is empty...',

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
            this.listenTo(this.items, 'remove', this._removeItem);
            this.listenTo(this.items, 'change', this._changeItem);
         }

         // Шаблон итема
         if (_.isFunction(options.templateItem)) {
            this.templateItem = options.templateItem;
         }

         // Текст отсутствия итемов
         this.nullText = options.nullText || this.nullText;
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
         options.nullText = this.nullText;

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
       * Рендер итема
       * @param {Backbone.Model} model
       */
      renderItem: function(model) {
         return tListItem({
            item: model,
            index: this.items.indexOf(model),
            params: {
               classNameItem: this.classNameItem,
               templateItem: this.templateItem
            }
         });
      },

      /**
       * Обрботчик добавления итема в коллекцию
       * @param {Backbone.Model} model
       * @param {Backbone.Collection} collection
       */
      _addItem: function(model, collection) {
         if (this.items.length === 1) {
            this.render();
         } else {
            this.$('.item').eq(this.items.indexOf(model) - 1)
               .after(this.renderItem(model));
         }
      },

      /**
       * Обработчик удаления итема из коллекции
       * @param {Backbone.Model} model
       * @param {Backbone.Collection} collection
       */
      _removeItem: function(model, collection, params) {
         this.$('.item').eq(params.index).remove();

         if (!this.items.length) {
            this.render();
         }
      },

      /**
       * Обработчик редактирования итема из коллекции
       * @param {Backbone.Model} model
       */
      _changeItem: function(model) {
         var index = this.items.indexOf(model);

         this.$('.item').eq(index).replaceWith(this.renderItem(model));
      }
   });
});