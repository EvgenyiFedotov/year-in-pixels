define([
   'Core/View',
   'jade!Pages/Years/Days/Template',
   'theme!css!Pages/Years/StatusDay/Marker',
   'css!Pages/Years/Days/Style'
], function(View, template) {
   'use strict';

   return View.extend({
      className: 'days',

      template: template,

      /**
       * @config {Array.<String>}
       */
      nameMonths: [
         'January', 'February', 'March', 'April', 'May', 'June', 'July',
         'August', 'September', 'October', 'November', 'December'
      ],

      /**
       * Год
       * @config {Number}
       */
      year: new Date().getFullYear(),

      /**
       * @param {Object} options
       */
      _init: function(options) {
         options.nameMonths = this.nameMonths;
         options.year = parseInt(options.year || this.year);
      }
      // initialize: function(options) {
         // options.nameMonths = this.nameMonths;
         // options.days = days;
         // options.year = parseInt(options.year || this.year);

         // View.prototype.initialize.apply(this, arguments);
      // }
   });
});