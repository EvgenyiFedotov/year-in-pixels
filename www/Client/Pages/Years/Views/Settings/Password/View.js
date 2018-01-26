define([
   'jade!Pages/Years/Views/Settings/Password/Template',
   'Core/Service',
   'Views/Informer/View',
   'css!Pages/Years/Views/Settings/Password/Style'
], function(template, Service, Informer) {
   'use strict';

   return Backbone.View.extend({
      className: 'form-password',

      /**
       * @config {Object}
       */
      events: {
         'click input[data-name="cancel"]': 'cancel',
         'click input[data-name="save"]': 'save'
      },

      /**
       * @param {Object} options
       */
      initialize: function (options) {
         this.render(options);
      },

      /**
       * Рендер
       * @param {Object} params
       */
      render: function(params) {
         var $template = $( template(params || {}) );
         this.$el.html($template);
         return this;
      },

      /**
       * Клик на кнопку отмены
       */
      cancel: function(e) {
         this.trigger('cancel', e);
      },

      /**
       * Клик на кнопку сохранения пароля
       */
      save: function(e) {
         var values = {};
         var isSend = false;
         var $fields = this.$('input[data-field]');

         $fields.each(function(index, el) {
            var $el = $(el);
            values[$el.attr('data-name')] = $el.val();
         });

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

                  $fields.each(function(index, el) {
                     $(el).val('');
                  });

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