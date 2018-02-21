define([
   'Pages/Years/Data/Status.Collection'
], function(Statuses, statuses) {
   'use strict';

   var statuses = new Statuses(window.statuses || [], {
      parse: true
   });

   if (window.statuses) {
      delete window.statuses;
   }

   return statuses;
});