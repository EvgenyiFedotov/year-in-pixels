define([
   'Pages/Years/Helpers'
], function(Helpers) {
   'use strict';

   // Запомним палетку локально
   var palette = window.palette;

   // Очистим глобальную переменную
   if (window.palette) {
      delete window.palette;
   }

   return function() {
      return palette.map(function(item) {
         item.attrs = {
            'data-color': item.color,
            'data-status': item.status,
            'data-text': item.note
         };
         item.style = Helpers.styleColorBlock(item.color);

         return item;
      });
   };
});