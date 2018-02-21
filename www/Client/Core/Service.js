define(function() {
   'use strict';

   return {
      /**
       * Ajax вызов
       * @param {String} method
       * @param {Object} data
       * @param {Object} addOptions
       */
      call: function(method, data, addOptions) {
         data = (data instanceof Object) ? data : {};
         addOptions = (addOptions instanceof Object) ? addOptions : {};
   
         var options = _.defaults(addOptions, {
            url: 'service/service',
            headers: {
               Method: method
            },
            data: JSON.stringify(data),
            contentType: 'application/json'
         });
   
         return Backbone.ajax(options);
      },

      /**
       * get-запрос
       * @param {String} method
       * @param {Object} data
       * @param {Object} callbacks
       * @param {Function} callbacks.success
       * @param {Function} callbacks.error
       */
      get: function(method, data, callbacks) {
         return this.call(method, data, {
            dataType: 'json',
            success: callbacks && callbacks.success,
            error: callbacks && callbacks.error
         });
      },

      /**
       * post-запрос
       * @param {String} method
       * @param {Object} data
       * @param {Object} callbacks
       * @param {Function} callbacks.success
       * @param {Function} callbacks.error
       */
      post: function(method, data, callbacks) {
         return this.call(method, data, {
            type: 'POST',
            dataType: 'json',
            success: callbacks && callbacks.success,
            error: callbacks && callbacks.error
         });
      },

      /**
       * put-запрос
       * @param {String} method
       * @param {Object} data
       * @param {Object} callbacks
       * @param {Function} callbacks.success
       * @param {Function} callbacks.error
       */
      put: function(method, data, callbacks) {
         return this.call(method, data, {
            type: 'PUT',
            dataType: 'json',
            success: callbacks && callbacks.success,
            error: callbacks && callbacks.error
         });
      },

      /**
       * delete-запрос
       * @param {String} method
       * @param {Object} data
       * @param {Object} callbacks
       * @param {Function} callbacks.success
       * @param {Function} callbacks.error
       */
      delete: function(method, data, callbacks) {
         return this.call(method, data, {
            type: 'DELETE',
            dataType: 'json',
            success: callbacks && callbacks.success,
            error: callbacks && callbacks.error
         });
      }
   };
});