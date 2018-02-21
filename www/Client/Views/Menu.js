define([
   'Views/List'
], function(List) {
   'use strict';

   return List.extend({
      classNameDefault: 'menu ' +  List.prototype.classNameDefault
   });
});