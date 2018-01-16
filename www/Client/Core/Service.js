define(function() {
   'use strict';

   /**
    * Получить строку запроса по объекту параметров
    * @param {Object} data
    */
   var queryStr = function(data) {
      if (data instanceof Object) {
         return '';
      } else {
         return '';
      }
   };

   console.log(11111111111111111111);

   /**
    * @param {Object} data
    * @param {Object} params
    */
   return function(method, data, params) {
      options = (options instanceof Object) ? options : {};
      params = (params instanceof Object) ? params : {};

      var dataStr = {};

      return Backbone.ajax({
         url: ['service/service', queryStr(dataStr)].join('?'),
         headers: {
            Method: method
         },
         data: {}
      });

      // return Backbone.ajax({
      //    type: "DELETE",
      //    url: 'service/service?c=3&d=4',
      //    headers: {
      //       Method: method
      //    },
      //    data: {}
      // });
   };
});