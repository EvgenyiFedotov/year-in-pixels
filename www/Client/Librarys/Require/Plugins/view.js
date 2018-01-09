define('view', {
   load: function (name, req, onload, config) {
      req([name, 'view-functions'], function (template, vFunctions) {
         onload(function (params, context) {
            var buildedTemplate = template(params);
            return vFunctions.template(buildedTemplate, params, context);
         });
      });
   }
});