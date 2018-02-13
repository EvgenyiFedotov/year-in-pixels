define([
   'Core/View',
   'Pages/Years/Navigation',
   'Pages/Years/Days',
   'Pages/Years/FormEditDay',
   'Core/Service',
   'css!Pages/Years/Style'
], function(View, Navigation, Days, FormEditDay, Service) {
   'use strict';

   return View.extend({
      /**
       * Селекторы
       * @config {Object}
       */
      selectors: {
         // Контент центр
         contentCenter: '.content>.center',

         // Навигация
         nav: '.content>.top>.navigation',
   
         // Данные дней
         days: '.content>.center>.days',
   
         // Форма редактирования дня
         formEditDay: '.content>.center>.form-edit-day'
      },

      /**
       * @config {Object}
       */
      _childs: {
         navigation: {
            include: ['Pages/Years/Navigation'],
            callback: function(Navigation ) {
               var navigation = new Navigation({
                  el: this.selector('nav')
               });

               return navigation;
            },
            events: {
               'navigate:settings': function(url) {
                  this.navigate('settings', {
                     trigger: false
                  });

                  this.showSettings();
               },
               'navigate:sign-out': function() {
                  Service.get('User.Singout', {}, {
                     success: function(result) {
                        window.location.reload();
                     }.bind(this)
                  });
               }
            }
         }
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         View.prototype.initialize.apply(this, arguments);

         // Создадим панель навигации
         this.child('navigation');

         // Создать область с данными дней
         this.createDays();

         // Создать форму редактирования дня
         this.createFormEditDay();
      },

      /**
       * Создать область с данными дней
       */
      createDays: function() {
         if (!this.days) {
            this.days = new Days({
               el: this.selector('days')
            });
         }
      },

      /**
       * Создать форму редактирования дня
       */
      createFormEditDay: function() {
         if (!this.formEditDay) {
            this.formEditDay = new FormEditDay({
               el: this.selector('formEditDay')
            });
         }
      },

      /**
       * Создать панель с настройками пользователя
       * @param {Function}
       */
      createSettings: function(callback) {
         if (!this.settings) {
            requirejs(['Pages/Years/Settings'], function(Settings) {
               var $settings = $('<div />', {
                  class: 'settings',
                  attr: {
                     'data-show': false
                  }
               });

               this.$(this.selector('contentCenter')).append($settings);

               this.settings = new Settings({
                  el: $settings
               });

               this.listenTo(this.settings, 'hide', function() {
                  this.elementDataShow('days', true);
                  this.elementDataShow('formEditDay', true);
                  this.navigate(null, {
                     trigger: false
                  });
               });

               if (callback instanceof Function) {
                  callback.call(this, this.settings);
               }
            }.bind(this));
         }
      },

      /**
       * Отобразить панель с настройками
       */
      _showSetting: function(settings) {
         if (settings) {
            settings.dataShow(true);
            this.elementDataShow('days', false);
            this.elementDataShow('formEditDay', false);
         }
      },

      /**
       * Создать и отобразить панель с настройками пользователя
       */
      showSettings: function() {
         // Создадим панель
         this.createSettings(this._showSetting);

         // Если уже создали
         this._showSetting(this.settings);
      }
   });
});