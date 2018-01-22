define([
   'Views/FloatArea/FloatArea',
   'jade!Pages/Years/Templates/MenuOptions'
], function(FloatArea, template) {
   'use strict';

   return FloatArea.extend({
      /**
       * @param {Object} options
       */
      initialize: function(options) {
         options.$el = $(template());

         FloatArea.prototype.initialize.apply(this, arguments);
      }
   });
});