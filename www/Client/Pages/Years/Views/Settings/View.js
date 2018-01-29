define([
   'jade!Pages/Years/Views/Settings/Template',
   'Views/ButtonPanel/View',
   'Pages/Years/Views/Settings/Password/View',
   'Views/ButtonMenu/View',
   'Core/Service',
   'css!Pages/Years/Views/Settings/Style'
], function(template, ButtonPanel, Password, ButtonMenu, Service) {
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

         // Кнопка с темой
         this.createButtonTheme();

         // Кнопка с паролем
         this.createButtonPassword();
      },

      /**
       * Создать представление (Меню) для кнопки с темой
       */
      createButtonTheme: function() {
         if (!this.buttonTheme) {
            this.buttonTheme = new ButtonMenu({
               el: this.$('.button[data-name="change-theme"]'),
               menu: {
                  items: [
                     {
                        content: "White",
                        attrs: {'data-name': 'White'}
                     }, {
                        content: "Black",
                        attrs: {'data-name': 'Black'}
                     }
                  ]
               }
            });

            // Событие клика по итему
            this.listenTo(this.buttonTheme, 'clickItem', function(data) {
               Service.post('Auth.ChangeTheme', data, {
                  success: function(result) {
                     window.location.reload();
                  }.bind(this)
               });
            });

            // Событие обображения
            this.listenTo(this.buttonTheme, 'show', function() {
               if (this.buttonPassword) {
                  this.buttonPassword.hide();
               }
            });
         }
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

            // Событие обображения
            this.listenTo(this.buttonPassword, 'show', function() {
               if (this.buttonTheme) {
                  this.buttonTheme.hide();
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