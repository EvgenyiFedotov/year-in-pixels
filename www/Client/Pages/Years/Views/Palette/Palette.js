define([
   'Views/FloatMenu/FloatMenu',
   'jade!Pages/Years/Views/Palette/Item',
   'Pages/Years/Helpers',
   'css!Pages/Years/Views/Palette/Palette'
], function(FloatMenu, templateItem, Helpers) {
   'use strict';

   // Запомним палетку локально
   var palette = window.palette;

   // Очистим глобальную переменную
   if (window.palette) {
      delete window.palette;
   }

   return FloatMenu.extend({
      className: 'palette',
      templateItem: templateItem,
      items: palette.map(function(item) {
         item.attrs = {
            'data-color': item.color,
            'data-status': item.status
         };
         item.style = Helpers.styleColorBlock(item.color);

         return item;
      })
   });
});