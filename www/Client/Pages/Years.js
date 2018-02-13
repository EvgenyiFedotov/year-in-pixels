define([
   'Core/View',
   'Core/Service',
   'Pages/Years/Data/Days',
   'css!Pages/Years/Style',
   'theme!css!Pages/Years/StatusDay/Marker'
], function(View, Service, days) {
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
         // Панель навигации
         navigation: {
            fastCreate: true,
            include: ['Pages/Years/Navigation'],
            callback: function(Navigation) {
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

                  // Отобразим интерфейс настроек пользователя
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
         },

         // Сетка дней
         days: {
            fastCreate: true,
            include: ['Pages/Years/Days'],
            callback: function(Days) {
               return new Days({
                  el: this.selector('days')
               });
            },
            events: {
               'clickDay': function(data) {
                  this.childs.formEditDay.setModel(this.findDay(data.date));
               }
            }
         },

         /**
          * Форма редактирования дня
          */
         formEditDay: {
            fastCreate: true,
            include: ['Pages/Years/FormEditDay'],
            callback: function(FormEditDay) {
               return new FormEditDay({
                  el: this.selector('formEditDay'),
                  model: this.findDay()
               });
            }
         },

         /**
          * Пользовательские настройки
          */
         settings: {
            include: ['Pages/Years/Settings'],
            callback: function(Settings) {
               var settings = new Settings({
                  el: '.content>.center>.settings'
               });

               return settings;
            },
            events: {
               'hide': function() {
                  this.elementDataShow('days', true);
                  this.elementDataShow('formEditDay', true);
                  this.navigate(null, {
                     trigger: false
                  });
               }
            }
         }
      },

      /**
       * @param {Object} options
       */
      _init: function(options) {
         // Создадим и подключим необходимые дочерние компоненты
         this.fastCreateChilds();
      },

      /**
       * Создать и отобразить панель с настройками пользователя
       */
      showSettings: function() {
         this.child('settings', function(settings) {
            settings.dataShow(true);
            this.childs.days.dataShow(false);
            this.childs.formEditDay.dataShow(false);
         });
      },

      /**
       * Найти модель дня, по dateSQL
       * если она будет не найдена
       * то создадим ее
       * @param {String|Date} date
       * @return {Day.Model}
       */
      findDay: function(date) {
         var toSQL = days.model.prototype.dateSQL;
         var dateSQL = _.isDate(date) ? toSQL(date) : date;
         var day = days.findWhere({
            dateSQL: dateSQL ? dateSQL : toSQL(new Date())
         });

         return day ? day : new days.model({
            date: date ? new Date(date) : new Date()
         });
      }
   });
});