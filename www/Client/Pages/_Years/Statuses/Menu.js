define([
   'Views/Menu/View',
   'Pages/Years/Statuses/Item',
   'css!Pages/Years/Statuses/Menu'
], function(Menu, tItem) {
   'use strict';

   var Menu = Menu.extend({
      className: 'statuses',
      templateItem: tItem
   });

   return Menu;
});