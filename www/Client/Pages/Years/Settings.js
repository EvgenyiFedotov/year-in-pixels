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

   var Service;

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
         'click buttonTheme': 'showMenuTheme',
         'click buttonPassword': 'showPanelPassword',
         'click .statuses .button[data-name="add"]': 'statusAdd',
         'click buttonEditStatus': "_statusEdit",
         'click buttonDeleteStatus': "_statusDelete"
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
      showMenuTheme: function() {
         this.createButtonTheme(function(menu) {
            menu.show();
         });

         if (this.buttonTheme) {
            this.buttonTheme.show();
         }
      },

      /**
       * Создать представление (Меню) для кнопки с темой
       * @param {Function} callback
       */
      createButtonTheme: function(callback) {
         if (!this.buttonTheme) {
            requirejs([
               'Views/ButtonMenu',
               'Core/Service'
            ], function(ButtonMenu, CoreService) {
               Service = CoreService;

               this.buttonTheme = new ButtonMenu({
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

               if (_.isFunction(callback)) {
                  callback.call(this, this.buttonTheme);
               }
            }.bind(this));
         }
      },

      /**
       * Показать панель для редактирования пароля
       */
      showPanelPassword: function() {
         this.createPanelPassword(function(view) {
            view.show();
         });

         if (this.panelPassword) {
            this.panelPassword.show();
         }
      },

      /**
       * Создать кнопку с панелью редактирования пароля
       * @param {Function} callback
       */
      createPanelPassword: function(callback) {
         if (!this.panelPassword) {
            requirejs([
               'Views/ButtonPanel',
               'Pages/Years/Settings/PanelEditPassword'
            ], function(ButtonPanel, PanelEditPassword) {
               var panelEditPassword = new PanelEditPassword();

               this.panelPassword = new ButtonPanel({
                  el: this.selector('buttonPassword'),
                  panel: {
                     $el: panelEditPassword.$el,
                     $border: $('body')
                  }
               });

               // Подпишися на события панели
               this.listenTo(panelEditPassword, 'cancel save', function() {
                  this.panelPassword.hide();
               });

               if (_.isFunction(callback)) {
                  callback.call(this, this.panelPassword);
               }
            }.bind(this));
         }
      },

      /**
       * Добавить статус
       */
      statusAdd: function() {
         this.child('formEditStatus', function(child, FormEditStatus) {
            if (!child) {
               child = new FormEditStatus({
                  el: this.$('.statuses>.form-edit-status')
               });

               // Подпишимся на положительное окончание редактирование статуса
               this.listenTo(child, 'save', function(model) {
                  statuses.add(model);
               });

               this.childs.formEditStatus = child;
            }

            // Добавим модель если это необходимо
            if (!child.model) {
               child.model = new statuses.model();
            }

            child.dataShow(true);
         }, ['Pages/Years/Settings/FormEditStatus']);
      },

      /**
       * Обработчик редактирования статуса
       */
      _statusEdit: function(e) {
         var $button = $(e.target).closest(this.selector('buttonEditStatus'));
         var formEditStatus = this.childs.formEditStatus;

         formEditStatus.setModel(statuses.get($button.data().cid));
         formEditStatus.dataShow(true);

         // Подпишимся на закрытие формы, чтобы убрать модель
         this.listenToOnce(formEditStatus, 'hide', function() {
            formEditStatus.setModel(null);
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