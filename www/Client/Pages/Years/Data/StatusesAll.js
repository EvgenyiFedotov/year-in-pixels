define([
   'Pages/Years/Data/Status.Collection'
], function(Statuses) {
   'use strict';

   var statuses = new Statuses(window.statusesAll || [], {
      parse: true
   });

   if (window.statusesAll) {
      delete window.statusesAll;
   }

   return statuses;
});