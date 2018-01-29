(function () {
   'use strict';

   window.config = {
      'baseUrl': 'Client',
      'theme': 'White',
      'paths': {
         'css': 'Librarys/Require/Plugins/Css/css',
         'jade-compiler': 'Librarys/Require/Plugins/jade-compiler',
         'jade': 'Librarys/Require/Plugins/jade',
         'theme': 'Librarys/Require/Plugins/theme',

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
         // 'css!Librarys/Bootstrap3/css/bootstrap.icons',
         'Router'
      ]
   };
})();