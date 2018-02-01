define([
   'Views/Menu/View',
   'Pages/Years/Palette/Items',
   'jade!Pages/Years/Palette/Item',
   'css!Pages/Years/Palette/Style'
], function(Menu, paletteItems, tPaletteItem) {
   'use strict';
   
   return Menu.extend({
      className: 'palette',
      templateItem: tPaletteItem,
      items: paletteItems()
   });
});