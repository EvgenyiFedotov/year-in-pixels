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

         // Настройки
         $data = $query->data();
         $action = $data["action"];

         // Корень директории из которой переносим файлы
         $pathFrom = "..";

         // Корень директории в которую переносим файлы
         $pathIn = "../../year-in-pix";

         // Иссключения (Передаются как регулярные выражения)
         $exceptions = [
            ".git",
            "www\/Client\/Librarys",
            ".*\.phtml",
            ".*\.less",
            ".*\.md",

            "www\/Service\/Librarys",
            "www\/Service\/Responses\/Administration"
         ];

         // Включения (Передаются как регулярные выражения)
         $includes = [
            "www/Client/Librarys/Require/require.js",
            "www/Client/Librarys/Require/require-load.js",
            "www/Client/Librarys/Require/Plugins",
            "www/Client/Librarys/Require/Plugins/Css/css.js",
            "www/Client/Librarys/jQuery/jquery.js",
            "www/Client/Librarys/Underscore/underscore.js",
            "www/Client/Librarys/Backbone/backbone.js",

            "www/Service/Responses/Administration/Setup.php",
            "www/Service/Librarys/NinjPhp",
            "www/Service/Librarys/NinjPhp/Query",
            "www/Service/Librarys/tale-config/ConfigurableTrait.php",
            "www/Service/Librarys/tale-pug/Compiler/functions.php",
            "www/Service/Librarys/tale-pug/Compiler/Exception.php",
            "www/Service/Librarys/tale-pug/Compiler.php",
            "www/Service/Librarys/tale-pug/Filter.php",
            "www/Service/Librarys/tale-pug/Lexer.php",
            "www/Service/Librarys/tale-pug/Parser/Node.php",
            "www/Service/Librarys/tale-pug/Parser.php",
            "www/Service/Librarys/tale-pug/Renderer/AdapterBase.php",
            "www/Service/Librarys/tale-pug/Renderer/Adapter/File.php",
            "www/Service/Librarys/tale-pug/Renderer.php",
            "www/Service/Librarys/Medoo/Medoo.php"
         ];

         // Если необходиммо минимизовать файлы
         if ($data["is-min"] === "true") {
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
         }

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