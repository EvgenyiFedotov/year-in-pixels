define([
   'jade!Pages/Years/Views/Settings/Template',
   'Views/ButtonPanel/View',
   'Pages/Years/Views/Settings/Password/View',
   'css!Pages/Years/Views/Settings/Style'
], function(template, ButtonPanel, Password) {
   'use strict';

   return Backbone.View.extend({
      /**
       * Контейнер темплейта
       * @config {jQuery}
       */
      $template: null,

      /**
       * @config {Object}
       */
      events: {
         'click .button[data-name="close"]': 'close'
      },

      /**
       * @param {Object} options
       * @param {Boolean} options.show
       */
      initialize: function (options) {
         this.$template = $('<div />', {
            class: 'settings',
            attr: {
               'data-show': !!options.show
            }
         });

         this.$el.append(this.$template);

         this.render(options);

         // Кнопка с паролем
         this.createButtonPassword();
      },

      /**
       * Создать представление (+ форму) для кнопки с паролем
       */
      createButtonPassword: function() {
         if (!this.buttonPassword) {
            var form = new Password();

            this.buttonPassword = new ButtonPanel({
               el: this.$('.button[data-name="change-password"]'),
               panel: {
                  $el: form.$el,
                  $border: $('body')
               }
            });

            // Событие закрытия
            this.listenTo(form, 'cancel', function() {
               this.buttonPassword.hide();
            });

            // Событие сохранения пароля
            this.listenTo(form, 'save', function() {
               this.buttonPassword.hide();
            });
         }
      },

      /**
       * Рендер
       * @param {Object} params
       */
      render: function(params) {
         this.$template.html( template(params || {}) );
         return this;
      },

      /**
       * Отобразить панель
       */
      show: function(e) {
         this.$template.attr('data-show', 'true');
         this.trigger('show', e);
      },

      /**
       * Скрыть панель
       */
      close: function(e) {
         this.$template.attr('data-show', 'false');
         this.trigger('close', e);
      }
   });
});