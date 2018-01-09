define('exist', {
   load: function (name, require, onload, config) {
      require([name], onload, function () {
         onload(null);
      });
   }
});