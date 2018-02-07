define([
   'Views/List'
], function(List) {
   'use strict';

   return List.extend({
      className: 'menu ' +  List.prototype.className
   });
});