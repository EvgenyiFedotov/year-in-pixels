define([
], function() {
   'use strict';

   return Backbone.View.extend({
      events: {
         'click': 'click'
      },

      /**
       * @param {Object} options
       */
      initialize: function(options) {
         
      },

      click: function() {
         console.log('Button.click');
      }
   });
});