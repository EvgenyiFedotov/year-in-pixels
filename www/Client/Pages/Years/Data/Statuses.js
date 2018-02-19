define([
   'Pages/Years/Data/Status.Collection'
], function(Statuses) {
   'use strict';

   var statuses = new Statuses(window.statuses || [], {
      parse: true
   });

   console.log(window.statuses);

   if (window.statuses) {
      delete window.statuses;
   }

   return statuses;
});