define([
   'Core/Form',
   'jade!Pages/Years/Settings/PanelEditPassword/Template',
   'css!Pages/Years/Settings/PanelEditPassword/Style'
], function(Form, template) {
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
      canсel: function() {
         this.trigger('cancel', e);
      }
   });
});