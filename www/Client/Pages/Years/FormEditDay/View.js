define([
   'Core/View',
   'jade!Pages/Years/FormEditDay/Template',
   'theme!css!Pages/Years/FormEditDay/Style'
], function(View, template) {
   'use strict';

   return View.extend({
      className: 'form-edit-day',
      template: template
   });
});