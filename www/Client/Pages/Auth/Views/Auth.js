define([
   'Core/Service',
   'Views/Informer/Informer'
], function(Service, Informer) {
   'use strict';

   return Backbone.View.extend({
      events: {
         'click .buttons-nav .button': '_clickNavButton',
         'click .form .button[name="send"]': '_clickButtonSend',
         'click .form .button[name="close"]': '_clickButtonClose'
      },

      /**
       * Клик по кнопкам навигации
       */
      _clickNavButton: function(e) {
         var $button = $(e.target).closest('.button');
         var buttonName = $button.attr('name');

         this.$('.form').attr({
            show: true,
            state: buttonName
         });
      },

      /**
       * Клик по кнопке отправки данных
       */
      _clickButtonSend: function() {
         var $form = this.$('.form');
         var formState = $form.attr('state');
         var values = {};

         $form.find('input').each(function(index, el) {
            var $el = $(el);
            values[$el.attr('name')] = $el.val();
         });

         Service.post('Auth.' + formState.replace('-', ''), values, {
            success: function(result, textStatus, jqXHR) {
               if (formState === 'sing-up') {
                  $form.attr('state', 'sing-in');

                  new Informer({
                     type: "success",
                     note: jqXHR.statusText
                  }).show();
               } else if (formState === 'sing-in') {
                  $form.attr('show', false);
               }

               console.log(result);
            },
            error: function(jqXHR, textStatus, message) {
               new Informer({
                  type: "error",
                  autoDestroy: false,
                  autoHide: false,
                  header: message
               }).show();
            }
         });
      },

      /**
       * Клик по кпопке закрытия формы
       */
      _clickButtonClose: function() {
         this.$('.form').attr('show', false);
      }
   });
});