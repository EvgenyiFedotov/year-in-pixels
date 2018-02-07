define([
   'Core/Form',
   'jade!Pages/Years/Settings/FormEditStatus/Template',
   'css!Pages/Years/Settings/FormEditStatus/Style'
], function(Form, template) {
   'use strict';

   return Form.extend({
      className: 'form-edit-status',
      template: template,
      
      events: {
         'click .button[data-name="close"]': 'close',
         'click .button[data-name="save"]': 'save'
      },

      /**
       * Скрыть форму
       */
      close: function() {
         this.dataShow(false);
      },

      /**
       * Созхранить данные статуса
       */
      save: function() {
         this.trigger('save', this.model);
         this.dataShow(false);

         // Уберем ссылку на модель
         this.model = null;
      }
   });
});