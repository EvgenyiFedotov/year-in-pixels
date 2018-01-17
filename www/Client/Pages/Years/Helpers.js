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
            ['background-color: ', color].join('')
         ].join('');
      }
   }
});