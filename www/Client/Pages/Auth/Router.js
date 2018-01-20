define([
   'Pages/Auth/Views/Auth',
   'css!Pages/Auth/Styles/Style'
], function(Auth) {
   'use strict';

   new Auth({
      el: $('body')
   });
});