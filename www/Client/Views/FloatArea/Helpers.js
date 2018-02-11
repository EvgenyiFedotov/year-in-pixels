define(function() {
   'use strict';

   return {
      /**
       * Получить границы элемента
       * @param {jQuery} $el
       */
      borderElement: function($el) {
         var offset = $el.offset();

         offset.right = offset.left + parseInt($el.css('width'));
         offset.bottom = offset.top + parseInt($el.css('height'));

         return offset;
      },

      /**
       * Получить флаги по сторонам, где контейнер выходдит за контейнер
       * @param {Object} offset1
       * @param {Object} offset2
       */
      checkBorders: function(offset1, offset2) {
         var result = {
            top: false,
            rigth: false,
            bottom: false,
            left: false
         };

         if (offset1.top < offset2.top) {
            result.top = true;
         }

         if (offset1.right > offset2.right) {
            result.rigth = true;
         }

         if (offset1.bottom > offset2.bottom) {
            result.bottom = true;
         }

         if (offset1.left < offset2.left) {
            result.left = true;
         }

         return result;
      }
   };
});