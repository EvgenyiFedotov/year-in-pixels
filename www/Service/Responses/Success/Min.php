<?php
   use MatthiasMullie\Minify;

   /**
    * Минимизация файлов
    */
   Query\route([
      "route" => "builder",
      "type" => "success",
      "priority" => 900,
      "handler" => function($require, $route, $configRoute, $query) {
         // Подключим файлы необходимые для минимзации файлов
         $require->includeFiles(["min", "Core/Builder.php"]);

         // Корень директории из которой переносим файлы
         $pathFrom = "Client";

         // Корень директории в которую переносим файлы
         $pathIn = "Client/min";

         // Иссключения (Передаются как регулярные выражения)
         $exceptions = [
            "Librarys", ".*\.phtml", ".*\.less"
         ];

         // Включения (Передаются как регулярные выражения)
         $includes = [
            "Librarys/Require/Plugins",
            "Librarys/Require/Plugins/Css/css.js",
            "Librarys/jQuery/jquery.js",
            "Librarys/Underscore/underscore.js",
            "Librarys/Backbone/backbone.js"
         ];

         /**
          * Обработчик контента
          * @param {Array.<String>} $pathInfo
          * @param {String} $content
          */
         $handlerContent = function($pathInfo, $content) {
            $extension = $pathInfo["extension"];

            // Минимизация контента
            if ($extension === "js") {
               $minifier = new Minify\JS();
               $minifier->add($content);
               $content = $minifier->minify();
            } elseif ($extension === "css") {
               $minifier = new Minify\CSS();
               $minifier->add($content);
               $content = $minifier->minify();
            }

            return $content;
         };

         $data = $query->data();
         $action = $data["action"];

         $builder = new Builder([
            "pathFrom" => "Client",
            "pathIn" => "Client/min",
            "exceptions" => $exceptions,
            "includes" => $includes,
            "handlerContent" => $handlerContent
         ]);

         if ($action === "remove") {
            $builder->removeFolder($pathIn);
         } elseif ($action === "clone") {
            $builder->cloneFolder($pathFrom, $pathIn, $exceptions, $includes, $handlerContent);
         } elseif ($action === "build") {
            $builder->build();
         }

         exit;
      }
   ]);
?>