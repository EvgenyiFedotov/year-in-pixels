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

         this.$fields.each(function(index, el) {
            var $el = $(el);
            values[$el.attr('data-name')] = $el.val();
         });

         return values;
      }
   });
});