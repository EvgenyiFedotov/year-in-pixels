define([
   'Core/View',
   'jade!Pages/Years/FormEditDay/Template',
   // 'jade!Pages/Years/StatusDay/Template',
   'Pages/Years/Data/Day.Model',
   'Views/FloatArea',
   'theme!css!Pages/Years/FormEditDay/Style'
], function(View, template, /*tStatusDay,*/ Model, FloatArea) {
   'use strict';

   return View.extend({
      className: 'form-edit-day',
      template: template,

      /**
       * @config {Object}
       */
      selectors: {
         // Статус
         status: '.status .day-marker-block>span',

         // Описание
         noteButtonEdit: '.note>.top>.button[data-name="edit"]',
         noteButtonSave: '.note>.top>.button[data-name="save"]',
         noteText: '.note>.text',
         noteTextarea: '.note>textarea'
      },

      /**
       * @config {Object}
       */
      events: {
         'click status': 'editStatus',
         'click noteButtonEdit': 'editNote',
         'click noteButtonSave': 'saveNote'
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         options = options instanceof Object ? options : {};

         // Настроим модель
         if (!(options.model instanceof Model)) {
            options.model = new Model();
            this.model = options.model;
         }

         // Подписка на события палетки
         // this.listenTo(palette, 'clickItem', this._clickItemPalette);

         // Подписка на события модели
         this.listenTo(this.model, 'change:note', this._changeNote);
         this.listenTo(this.model, 'change:status', this._changeStatus);

         View.prototype.initialize.apply(this, arguments);
      },

      /**
       * Редактирование статуса дня
       */
      editStatus: function() {
      },

      /**
       * Редактирование описания дня
       */
      editNote: function() {
         // Настройка видимости
         this.$element('noteButtonEdit').attr('data-show', false);
         this.$element('noteText').attr('data-show', false);
         this.$element('noteButtonSave').attr('data-show', true);
         this.$element('noteTextarea').attr('data-show', true);
      },

      /**
       * Сохранить описание
       */
      saveNote: function() {
         var $textarea = this.$(selectors.noteTextarea);

         // Установим значение описания в модель
         this.model.set('note', $textarea.val());

         // Настройка видимости
         this.$(selectors.noteButtonEdit).attr('data-show', true);
         this.$(selectors.noteText).attr('data-show', true);
         this.$(selectors.noteButtonSave).attr('data-show', false);
         $textarea.attr('data-show', false);
      },

      /**
       * Обработчик изменения описания в модели
       * @param {Day.Model}
       * @param {String} value
       */
      _changeNote: function(model, value) {
         this.$(selectors.noteTextarea).val(value);
         this.$(selectors.noteText).text(value);
      },

      /**
       * Обработчик клика по итему палетки
       * @param {Object} data
       */
      _clickItemPalette: function(data) {
         this.model.set({
            status: data.status,
            statusColor: data.color,
            statusText: data.text
         });
      },

      /**
       * Обработчик изменения статуса в модели
       * @param {Day.Model} model
       * @param {Object} status
       */
      _changeStatus: function(model, status) {
         // this.$(selectors.status).html(tStatusDay({model: model}));
      }
   });
});