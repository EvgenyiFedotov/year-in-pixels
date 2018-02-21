define([
   'Pages/Years/Data/Day.Collection'
], function(Days) {
   'use strict';

   var days = new Days(window.days || [], {
      parse: true
   });

   if (window.days) {
      delete window.days;
   }

   return days;
});