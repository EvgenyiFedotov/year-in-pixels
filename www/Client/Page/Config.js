(function () {
   'use strict';

   window.config = {
      'baseUrl': 'Client',
      'paths': {
         'css': 'Librarys/Require/Plugins/Css/css',
         'jade-compiler': 'Librarys/Require/Plugins/jade-compiler',
         'jade': 'Librarys/Require/Plugins/jade',
         'view': 'Librarys/Require/Plugins/view',
         'view-functions': 'Librarys/Require/Plugins/view-functions',
         'exist': 'Librarys/Require/Plugins/exist',

         'jQuery': 'Librarys/jQuery/jquery',
         'Underscore': 'Librarys/Underscore/underscore',
         'Backbone': 'Librarys/Backbone/backbone',

         'Router': 'Page/Router'
      },
      'shim': {
         'Backbone' : {
            'deps' : [
               'jQuery',
               'Underscore'
            ],
            'exports': 'Backbone'
         },
         'Router': {
            'deps': ['Backbone']
         }
      },
      'deps': [
         'Backbone',
         'css!Librarys/Bootstrap3/css/bootstrap.icons',
         'Router'
      ]
   };
})();