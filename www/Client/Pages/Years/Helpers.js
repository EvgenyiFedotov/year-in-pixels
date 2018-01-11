define(function() {
   'use strict';

   return {
      /**
       * Получить стиль границы и фона для дня (Цветного блока)
       * @param {String} Color
       * @return {String}
       */
      styleColorBlock: function(color) {
         return [
            ['border: 1px solid ', '; '].join(color),
            ['background: repeating-linear-gradient(-45deg, white, white 5px, ', ' 5px, ', ' 10px);'].join(color)
         ].join('');
      }
   }
});