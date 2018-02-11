define([
   'Core/View',
   'jade!Pages/Years/Navigation/Template',
   'css!Pages/Years/Navigation/Style'
], function(View, template) {
   'use strict';
   
   return View.extend({
      className: 'navigation',
      template: template,

      /**
       * @config {Object}
       */
      _childs: {
         buttonMenu: {
            include: ['Views/ButtonMenu'],
            callback: function(ButtonMenu) {
               var button = new ButtonMenu({
                  el: this.$('.button[data-name="menu"]'),
                  menu: {
                     items: [
                        {
                           content: 'Settings',
                           attrs: {'data-name': 'settings'}
                        }, {
                           content: 'Sign out',
                           attrs: {'data-name': 'sign-out'}
                        }
                     ]
                  }
               });

               return button;
            },
            handlers: [
               {
                  event: 'clickItem',
                  callback: function(data) {
                     this.navigate(data.name);
                  }
               }
            ]
         }
      },

      _init: function() {
         // Создадим кнопку
         this.child('buttonMenu');
      }
   });
});