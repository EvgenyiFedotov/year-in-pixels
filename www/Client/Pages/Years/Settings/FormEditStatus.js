define([
   'Core/Form',
   'jade!Pages/Years/Settings/FormEditStatus/Template',
   'jade!Pages/Years/Settings/FormEditStatus/PaletteItem',
   'css!Pages/Years/Settings/FormEditStatus/Style'
], function(Form, template, tPaletteItem) {
   'use strict';

   return Form.extend({
      className: 'form-edit-status',
      template: template,
      
      events: {
         'click .button[data-name="close"]': 'close',
         'click .button[data-name="save"]': 'save',
         'click .marker-day': 'showPalette'
      },

      /**
       * Скрыть форму
       */
      close: function() {
         this.dataShow(false);
      },

      /**
       * Созхранить данные статуса
       */
      save: function() {
         // Установим значения в форму
         this.model.set(this.fieldsValues());

         this.trigger('save', this.model);
         this.dataShow(false);

         // Очистим форму
         this.clearFiledsValues();

         // Уберем ссылку на модель
         this.setModel(null);
      },

      /**
       * Показать палитру
       */
      showPalette: function(e) {
         this.child('palette', function(child, List, FloatArea) {
            if (!child) {
               var listPalette = new List({
                  className: 'palette',
                  classNameItem: 'marker-day',
                  templateItem: tPaletteItem,
                  items: [
                     '#F44336', '#E91E63', '#9C27B0', '#673AB7',
                     '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
                     '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
                     '#FFEB3B', '#FFC107', '#FF5722', '#212121'
                  ].map(function(color) {
                     return {color: color};
                  })
               });

               this.childs.palette = new FloatArea({
                  area: listPalette
               });
            }

            this.childs.palette.show($(e.target));

            console.log('showPalette');
            console.log(arguments);
         }, ['Views/List', 'Views/FloatArea']);
      },

      /**
       * Создать палетку (палитру цветов)
       */
      createPalette: function() {
         
      }
   });
});