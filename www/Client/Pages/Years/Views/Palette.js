define(function() {
   'use strict';

   return Backbone.View.extend({
      /**
       * @config {String}
       */
      date: null,

      /**
       * @config {Object}
       */
      events: {
         'click .palette-item': function(e) {
            this.trigger('click', this.date, $(e.target).closest('.palette-item').data());
         }
      }
   });
});