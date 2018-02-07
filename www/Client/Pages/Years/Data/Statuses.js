define([
   'Pages/Years/Data/Status.Collection'
], function(Statuses) {
   'use strict';

   var statuses = new Statuses(window.statuses || []);

   if (window.statuses) {
      delete window.statuses;
   }

   return statuses;
});