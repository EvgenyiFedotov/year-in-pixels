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
         $pathFrom = ".";

         // Корень директории в которую переносим файлы
         $pathIn = "../build";

         // Иссключения (Передаются как регулярные выражения)
         $exceptions = [
            "Client\/Librarys",
            ".*\.phtml",
            ".*\.less",
            "Service\/Librarys"
         ];

         // Включения (Передаются как регулярные выражения)
         $includes = [
            "Client/Librarys/Require/Plugins",
            "Client/Librarys/Require/Plugins/Css/css.js",
            "Client/Librarys/jQuery/jquery.js",
            "Client/Librarys/Underscore/underscore.js",
            "Client/Librarys/Backbone/backbone.js",
            "Service/Librarys"
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
            "pathFrom" => $pathFrom,
            "pathIn" => $pathIn,
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