define([
   'Pages/Years/Data/Status.Collection'
], function(Statuses) {
   'use strict';

   var statusesIsDelete = new Statuses(window.statusesIsDelete || [], {
      parse: true
   });

   if (window.statusesIsDelete) {
      delete window.statusesIsDelete;
   }

   return statusesIsDelete;
});