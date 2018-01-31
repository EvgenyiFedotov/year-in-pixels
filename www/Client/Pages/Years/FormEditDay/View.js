define([
   'Core/View',
   'jade!Pages/Years/FormEditDay/Template',
   'Pages/Years/FormEditDay/Day.Model',
   'theme!css!Pages/Years/FormEditDay/Style'
], function(View, template, Model) {
   'use strict';

   // Карта селекторов представления
   var selectors = {
      noteButtonEdit: '.note>.top>.button[data-name="edit"]',
      noteButtonSave: '.note>.top>.button[data-name="save"]',
      noteText: '.note>.text',
      noteTextarea: '.note>textarea'
   };

   return View.extend({
      className: 'form-edit-day',
      template: template,
      events: function() {
         var events = {};

         events['click ' + selectors.noteButtonEdit] = 'editNote';
         events['click ' + selectors.noteButtonSave] = 'saveNote';

         return events;
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

         View.prototype.initialize.apply(this, arguments);
      },

      /**
       * Редактирование описания дня
       */
      editNote: function() {
         this.$(selectors.noteButtonEdit).attr('data-show', false);
         this.$(selectors.noteText).attr('data-show', false);
         this.$(selectors.noteButtonSave).attr('data-show', true);
         this.$(selectors.noteTextarea).attr('data-show', true);
      },

      /**
       * Сохранить описание
       */
      saveNote: function() {
         this.$(selectors.noteButtonEdit).attr('data-show', true);
         this.$(selectors.noteText).attr('data-show', true);
         this.$(selectors.noteButtonSave).attr('data-show', false);
         this.$(selectors.noteTextarea).attr('data-show', false);
      }
   });
});