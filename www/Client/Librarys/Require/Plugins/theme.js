(function() {
   'use strict';

   define('theme', {
      load: function (name, req, onload, config) {
         // Настроим корректный путь до файла стилем
         var nameArr = name.split('/');

         nameArr.push(config.theme);

         name = nameArr.join('/');

         req([name], function (template) {
            onload(template);
         });
      }
   });
})();