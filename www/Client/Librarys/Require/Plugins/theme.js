(function() {
   'use strict';

   define('theme', {
      load: function (name, req, onload, config) {
         // Настроим корректный путь до файла стилем
         var nameArr = name.split('/');

         nameArr[nameArr.length - 1] = [
            config.theme,
            nameArr[nameArr.length - 1]
         ].join('/');

         name = nameArr.join('/');

         req([name], function (template) {
            onload(template);
         });
      }
   });
})();