define([
   'Core/View',
   'jade!Pages/Years/Settings/Template',
   'Pages/Years/Data/statuses',
   'Views/List',
   'jade!Pages/Years/Settings/StatusDay',
   'css!Pages/Years/Settings/Style',
   'css!Pages/Years/StatusDay/Style'
], function(View, template, statuses, List, tStatusDay) {
   'use strict';

   return View.extend({
      className: 'settings',
      template: template,
      model: new Backbone.Model(window.user),

      selectors: {
         close: '.main>.top>.button[data-name="close"]',
         buttonTheme: '.button[data-name="change-theme"]',
         buttonPassword: '.button[data-name="change-password"]',
         buttonEditStatus: '.statuses .item>.buttons>.button[data-name="edit"]',
         buttonDeleteStatus: '.statuses .item>.buttons>.button[data-name="delete"]'
      },

      events: {
         'click close': 'close',
         'click buttonTheme': 'showThemeMenu',
         'click buttonPassword': 'showFormEditPassword',
         'click .statuses .button[data-name="add"]': 'statusAdd',
         'click buttonEditStatus': "_statusEdit",
         'click buttonDeleteStatus': "_statusDelete"
      },

      /**
       * Настройки дочерних компонентов
       */
      _childs: {
         /**
          * Меню редактирования темы
          */
         themeMenu: {
            include: ['Views/ButtonMenu', 'Core/Service'],
            callback: function(ButtonMenu, Service) {
               var menu = new ButtonMenu({
                  el: this.selector('buttonTheme'),
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
               this.listenTo(menu, 'clickItem', function(data) {
                  Service.post('Auth.ChangeTheme', data, {
                     success: function(result) {
                        window.location.reload();
                     }.bind(this)
                  });
               });

               return menu;
            }
         },

         /**
          * Форма редактирования пароля
          */
         formEditPassword: {
            include: ['Pages/Years/Settings/FormEditPassword'],
            callback: function(FormEditPassword) {
               return new FormEditPassword();
            }
         },

         /**
          * Форма редактирования пароля
          */
         buttonEditPassword: {
            include: ['Views/ButtonArea'],
            callback: function(ButtonArea, callback) {
               this.child('formEditPassword', function(form) {
                  var button = new ButtonArea({
                     el: this.selector('buttonPassword'),
                     floatArea: {
                        area: form.$el,
                        border: $('body'),
                        autoHide: false
                     }
                  });

                  // Обработчик закрытия формы
                  this.listenTo(form, 'cancel', function () {
                     button.hideArea();
                  });

                  callback(button);
               });
            }
         },

         /**
          * Форма редактирования статуса
          */
         formEditStatus: {
            include: ['Pages/Years/Settings/FormEditStatus'],
            callback: function(FormEditStatus) {
               var child = new FormEditStatus({
                  el: this.$('.statuses>.form-edit-status')
               });

               // Подпишимся на положительное окончание редактирование статуса
               this.listenTo(child, 'save', function(model) {
                  statuses.add(model);
               });

               return child;
            }
         }
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         View.prototype.initialize.apply(this, arguments);

         // Создать список статусов
         this.list = new List({
            el: this.$('.statuses>.list'),
            templateItem: tStatusDay,
            items: statuses
         });
      },

      /**
       * Скрыть / закрыть окно
       */
      close: function() {
         this.dataShow(false);
      },

      /**
       * Показать меню с темами
       */
      showThemeMenu: function() {
         this.child('themeMenu', function(menu) {
            menu.showMenu();
         });
      },

      /**
       * Показать панель для редактирования пароля
       */
      showFormEditPassword: function() {
         this.child('buttonEditPassword', function(button) {
            button.showArea();
         });
      },

      /**
       * Добавить статус
       */
      statusAdd: function() {
         this.child('formEditStatus', function(form) {
            // Добавим модель если это необходимо
            if (!form.model) {
               form.model = new statuses.model();
            }

            form.dataShow(true);
         });
      },

      /**
       * Обработчик редактирования статуса
       */
      _statusEdit: function(e) {
         this.child('formEditStatus', function(form) {
            var $button = $(e.target).closest(this.selector('buttonEditStatus'));

            form.setModel(statuses.get($button.data().id));
            form.dataShow(true);

            // Подпишимся на закрытие формы, чтобы убрать модель
            this.listenToOnce(form, 'hide', function() {
               form.setModel(null);
            });
         });
      },
      
      /**
       * Обработчик удаления статуса
       */
      _statusDelete: function(e) {
         var $button = $(e.target).closest(this.selector('buttonDeleteStatus'));
         statuses.remove($button.data().cid);
      }
   });
});