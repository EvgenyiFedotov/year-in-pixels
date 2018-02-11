define(function() {
   'use strict';
   
   return Backbone.Model.extend({
      url: 'service/service',

      /**
       * Объект
       * @config {String}
       */
      object: null,

      /**
       * @param {String} method
       * @param {Backbone.Model} model
       * @param {Object} options
       */
      sync: function(method, model, options) {
         // Назначим объект сервиса
         if (this.object) {
            options.headers = {
               Method: this.object + '.' + method
            };
         }

         // Доработаем настройки для метода удаления
         if (method === 'delete') {
            options.data = JSON.stringify({
               id: model.id
            });
            options.contentType = 'application/json';
         }

         Backbone.Model.prototype.sync.apply(this, arguments);
      }
   });
});