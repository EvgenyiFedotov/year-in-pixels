define([
   'Core/Form',
   'jade!Pages/Years/FormEditDay/Template',
   'Pages/Years/Data/Day.Model',
   'Pages/Years/Data/statuses',
   'jade!Pages/Years/StatusDay/Template',
   'theme!css!Pages/Years/FormEditDay/Style'
], function(Form, template, DayModel, statuses, tStatusDay) {
   'use strict';

   return Form.extend({
      className: 'form-edit-day',
      template: template,
      instanceModel: DayModel,

      /**
       * @config {Object}
       */
      selectors: {
         statusMarker: '.status>.status-block .marker-day',
         statusNote: '.status>.status-block .note',

         // Описание
         noteButtonEdit: '.note>.top>.button[data-name="edit"]',
         noteButtonSave: '.note>.top>.button[data-name="save"]',
         noteText: '.note>.text',
         noteTextarea: '.note>textarea'
      },

      /**
       * @config {Object}
       */
      events: {
         'click noteButtonEdit': 'noteEdit',
         'click noteButtonSave': 'noteSave'
      },

      /**
       * @config {Object}
       */
      eventsModel: {
         'change:note': '_changeNote',
         'change:status_id': '_changeStatus'
      },

      /**
       * @config {Object}
       */
      _childs: {
         // Кнопка редактирования статуса
         buttonStatuses: {
            fastCreate: true,
            include: ['Views/ButtonMenu'],
            callback: function(ButtonMenu) {
               var button = new ButtonMenu({
                  el: this.selector('statusMarker'),
                  menu: {
                     className: 'form-edit-day-menu-statuses',
                     items: statuses,
                     templateItem: tStatusDay
                  }
               });

               return button;
            },
            events: {
               'clickItem': function(data) {
                  this.model.set('status_id', parseInt(data.id));
                  this.model.save();
               }
            }
         }
      },

      /**
       * Сменить видимость элементов редактирования описания
       * @param {Boolean} isEdit
       */
      _visibleViewsNote: function(isEdit) {
         this.elementDataShow('noteButtonEdit', !isEdit);
         this.elementDataShow('noteText', !isEdit);
         this.elementDataShow('noteButtonSave', isEdit);
         this.elementDataShow('noteTextarea', isEdit);
      },

      /**
       * Редактировать описание
       */
      noteEdit: function() {
         this._visibleViewsNote(true);
      },

      /**
       * Сохранить описание (в модель)
       */
      noteSave: function() {
         this._visibleViewsNote(false);

         // Установим значение описания в модель
         this.model.set('note', this.fieldsValues().note);
         this.model.save();
      },

      /**
       * Изменение описания дня
       * @param {Model} model
       * @param {String} note
       */
      _changeNote: function(model, note) {
         this.$element('noteTextarea').val(note);
         this.$element('noteText').text(note);
      },

      /**
       * Изменение статуса
       * @param {Model} model
       * @param {Number} statusId
       */
      _changeStatus: function(model, statusId) {
         var status = model.status();

         this.$element('statusMarker').attr('style', status.get('styleMarker'));
         this.$element('statusNote').text(status.get('note'));
      }
   });
});