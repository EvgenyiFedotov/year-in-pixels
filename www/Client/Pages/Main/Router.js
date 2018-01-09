define('Pages/Main/Router', [
   'css!Pages/Main/Styles/Main',
   'css!Pages/Main/Styles/Event'
], function () {
   'use strict';

   var Router = Backbone.Router.extend({
      routes: {
         'page': 'main',
         'page=(:main)': 'main'
      },
      main: function (page) {
         console.log('Router:', page);
      }
   });

   new Router();
});