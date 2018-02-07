define([
   'Pages/Auth',
   'css!Pages/Auth/Style'
], function(Auth) {
   'use strict';

   var auth = new Auth({
      el: $('body')
   });

   var Router = Backbone.Router.extend({
      routes: {
         'state=:state': 'state'
      },
      state: function(state) {
         auth.showForm(state);
      }
   });

   auth.router = new Router();
});