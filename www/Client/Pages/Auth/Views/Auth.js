define([
], function() {
   'use strict';

   return Backbone.View.extend({
      events: {
         'click .buttons-nav .button': '_clickNavButton',
         'click .button[name="send"]': '_clickButtonSend',
         'click .button[name="close"]': '_clickButtonClose'
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

         if (formState === 'sing-up') {
            $form.attr('state', 'sing-in');
         } else if (formState === 'sing-in') {
            $form.attr('show', false);
         }
      },

      /**
       * Клик по кпопке закрытия формы
       */
      _clickButtonClose: function() {
         this.$('.form').attr('show', false);
      }
   });
});