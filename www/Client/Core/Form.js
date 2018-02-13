define(['Core/View'], function(View) {
   'use strict';

   return View.extend({
      /**
       * Получить элементы DOM, которые являются полями формы
       * которые редактируются
       */
      $fields: function() {
         return this.$('[data-is-field="true"]');
      },

      /**
       * Получить значения полей, которые редактируются
       * Внимание! чтобы получить корректный объект значений
       * нужно чтобы у элементов были мена назначенные через аттрибут "data-name"
       */
      fieldsValues: function() {
         var values = {};

         this.$fields().each(function(index, el) {
            var $el = $(el);
            var value = undefined;

            // Получим корректное значние
            if ($el.val) {
               value = $el.val();
            } else if ($el.value) {
               value = $el.value();
            }

            values[$el.attr('data-name')] = value;
         });

         return values;
      },

      /**
       * Очистить значения полей
       */
      clearFields: function() {
         this.$fields().each(function(index, el) {
            var $el = $(el);

            if ($el.val) {
               $el.val(null);
            } else if ($el.value) {
               $el.value(null);
            }
         });
      },

      /**
       * Установить модель
       * @param {Backbone.Model} model
       */
      setModel: function(model) {
         this.model = model;
         this.render();

         // Если передали модель, то установим значения в поля
         if (model) {
            this.setValues(model.attributes);
         }
      },

      /**
       * Установить значния в DOM элементы
       * @param {Object} values
       */
      setValues: function(values) {
         this.$fields().each(function(index, el) {
            var $el = $(el);
            var name = $el.attr('data-name');
            var value;

            if (name in values) {
               value = values[name];

               if ($el.val) {
                  $el.val(value);
               } else if ($el.value) {
                  $el.value(value);
               }
            }
         });
      },

      /**
       * Обработчик сохранения данных
       */
      save: function() {
         this.trigger('save', this.fieldsValues());

         // Очистим форму
         this.clearFields();
      },

      /**
       * Отмена изменений
       */
      clear: function() {
         this.trigger('clear', this.fieldsValues());

         // Очистим форму
         this.clearFields();
      },

      /**
       * Закрыть форму
       */
      close: function() {
         this.clear();
         this.hide();
      }
   });
});