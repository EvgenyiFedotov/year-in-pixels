define([
   'Core/Form',
   'jade!Pages/Years/FormEditDay/Template',
   'Pages/Years/Data/Day.Model',
   'theme!css!Pages/Years/FormEditDay/Style'
], function(Form, template, DayModel) {
   'use strict';

   return Form.extend({
      className: 'form-edit-day',
      template: template,
      instanceModel: DayModel,

      /**
       * @config {Object}
       */
      selectors: {
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
         'click noteButtonEdit': 'noteEdit',
         'click noteButtonSave': 'noteSave'
      },

      /**
       * @config {Object}
       */
      eventsModel: {
         'change:note': '_changeNote'
      },

      /**
       * Сменить видимость элементов редактирования описания
       * @param {Boolean} isEdit
       */
      _visibleViewsNote: function(isEdit) {
         this.elementDataShow('noteButtonEdit', !isEdit);
         this.elementDataShow('noteText', !isEdit);
         this.elementDataShow('noteButtonSave', isEdit);
         this.elementDataShow('noteTextarea', isEdit);
      },

      /**
       * Редактировать описание
       */
      noteEdit: function() {
         this._visibleViewsNote(true);
      },

      /**
       * Сохранить описание (в модель)
       */
      noteSave: function() {
         this._visibleViewsNote(false);

         // Установим значение описания в модель
         this.model.set('note',this.fieldsValues().note);
      },

      _changeNote: function() {
         console.log(arguments);
      }
   });
});