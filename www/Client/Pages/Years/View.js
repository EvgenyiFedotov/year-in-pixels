define([
   'Core/View',
   'Pages/Years/Navigation/View',
   'Pages/Years/Days/View',
   'Pages/Years/FormEditDay/View',
   'Core/Service'
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
       * @param {Object} options
       */
      initialize: function(options) {
         View.prototype.initialize.apply(this, arguments);

         // Создадим панель навигации
         this.ctreateNavigation();

         // Создать область с данными дней
         this.createDays();

         // Создать форму редактирования дня
         this.createFormEditDay();
      },

      /**
       * Создать панель навигации
       */
      ctreateNavigation: function() {
         if (!this.navigation) {
            this.navigation = new Navigation({
               el: this.selector('nav')
            });

            // Обработчики событий навигации
            this.listenToOnce(this.navigation, 'createMenu', function() {
               // Обработчики событий меню
               this.listenTo(this.navigation.menu, 'hide', function() {
                  if (window.location.hash !== '#settings') {
                     this.navigate(null);
                  }
               });

               this.listenTo(this.navigation.menu, 'show', function() {
                  this.navigate('menu');
               });

               this.listenTo(this.navigation.menu, 'clickItem', function(data) {
                  // Настройки
                  if (data.name === 'settings') {
                     // Создалим панель настроек, если это необходимо и отобразим ее
                     this.showSettings();

                     this.navigate('settings');

                  // Выход
                  } else if (data.name === 'sign-out') {
                     Service.get('Auth.Singout', {}, {
                        success: function(result) {
                           window.location.reload();
                        }.bind(this)
                     });
                  }
               });
            });
         }
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
            requirejs(['Pages/Years/Settings/View'], function(Settings) {
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
                  this.$elementDataShow('days', true);
                  this.$elementDataShow('formEditDay', true);
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
            this.$elementDataShow('days', false);
            this.$elementDataShow('formEditDay', false);
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