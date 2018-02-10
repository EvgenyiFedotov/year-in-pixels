define([
   'Core/Form',
   'jade!Pages/Years/Settings/PanelEditPassword/Template',
   'Views/Informer',
   'Core/Service',
   'css!Pages/Years/Settings/PanelEditPassword/Style'
], function(Form, template, Informer, Service) {
   'use strict';
   
   return Form.extend({
      className: 'panel-edit-password',
      template: template,

      events: {
         'click input[data-name="cancel"]': 'cancel',
         'click input[data-name="save"]': 'save'
      },

      /**
       * Омена изменений
       */
      cancel: function(e) {
         this.clearFields();
         this.trigger('cancel', e);
      },

      /**
       * Сохранение изменений
       */
      save: function(e) {
         var values = this.fieldsValues();
         var isSend = false;

         isSend = _.values(values).reduce(function(result, value) {
            return result && !!value;
         }, true);

         if (isSend) {
            Service.post('Auth.PasswordEdit', values, {
               success: function(result, textStatus, jqXHR) {
                  new Informer({
                     type: 'success',
                     header: 'Password changed',
                     note: jqXHR.statusText
                  }).show();

                  this.clearFields();

                  this.trigger('save', e);
               }.bind(this),
               error: function(jqXHR, textStatus, message) {
                  new Informer({
                     type: 'error',
                     autoDestroy: false,
                     autoHide: false,
                     header: message
                  }).show();
               }
            });
         } else {
            new Informer({
               type: "error",
               autoDestroy: false,
               autoHide: false,
               header: 'Error',
               note: 'The fields are not filled correctly!'
            }).show();
         }
      }
   });
});