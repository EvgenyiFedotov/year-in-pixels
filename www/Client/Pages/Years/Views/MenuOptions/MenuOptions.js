define([
   'Views/FloatMenu/FloatMenu',
   'css!Pages/Years/Views/MenuOptions/MenuOptions'
], function(FloatMenu, template) {
   'use strict';

   return FloatMenu.extend({
      className: 'menu-options',
      items: [
         {
            content: 'Settings',
            attrs: {
               'data-name': 'settings'
            }
         }, {
            content: 'Sign out',
            attrs: {
               'data-name': 'sign-out'
            }
         }
      ]
   });
});