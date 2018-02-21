<?php
   use MatthiasMullie\Minify;

   /**
    * Минимизация файлов
    */
   Query\route([
      "route" => "min",
      "type" => "success",
      "priority" => 900,
      "handler" => function($require, $route, $configRoute, $query) {
         /**
          * Проверить является ли путь исключением
          * @param {String} $path
          * @param {Array.<String>} [$exceptions]
          */
         function isExceptionPath($path, $exceptions = []) {
            $checkPath = explode("/", $path);
            array_shift($checkPath);
            $checkPath = join("/", $checkPath);
            $isException = false;
            $matchResult = [];

            foreach ($exceptions as $indexExc => $exception) {
               preg_match_all("/^". $exception . "/", $checkPath, $matchResult);

               if (count($matchResult[0])) {
                  $isException = true;
               }
            }

            return $isException;
         };

         /**
          * Преобразовать путь до пути минимальной версии
          * @param {String} $root
          * @param {String} $path
          */
         function toPathMin($root, $path) {
            $pathArr = explode("/", $path);
            $pathArr[0] = $root;
            return join("/", $pathArr);
         };

         /**
          * Копировать файл
          * @param {String} $pathFrom
          * @param {String} $pathIn
          */
         function copyFile($pathFrom, $pathIn) {
            $content = file_get_contents($pathFrom);

            // Минимазация контента
            $pathInfo = pathinfo($pathFrom);
            $extension = $pathInfo["extension"];

            if ($extension === "js") {
               $minifier = new Minify\JS();
               $minifier->add($content);
               $content = $minifier->minify();
            } elseif ($extension === "css") {
               $minifier = new Minify\CSS();
               $minifier->add($content);
               $content = $minifier->minify();
            }

            file_put_contents($pathIn, $content);
         };

         /**
          * Копировать дирректорию
          * 
          * @param {String} $pathFrom
          * @param {String} $pathIn
          * @param {Array.<String>} [$exceptions] (Передаются как регулярные выражения)
          * @param {Array.<String>} [$includes] (Передаются как регулярные выражения)
          */
         function cloneFolder($require, $pathFrom, $pathIn, $exceptions = [], $includes = []) {
            // Пути до файлов и дирректорий
            $paths = $require->pathFilesDir($pathFrom, true);

            // Создадим корневую папку минимизированных файлов
            if (!file_exists($pathIn)) {
               mkdir($pathIn);
            }

            echo "<b>Clone:</b></br>";
            echo "<b><i>Folders:</i></b></br>";

            // Склонируем папки в минимальную версию
            foreach ($paths["dirs"] as $key => $path) {
               // Узнаем иссключение или нет
               $isException = isExceptionPath($path, $exceptions);

               // Если не является исключением, копируем
               if ($isException === false) {
                  $pathMin = toPathMin($pathIn, $path);
                  echo $pathMin . "</br>";

                  if (!file_exists($pathMin)) {
                     mkdir($pathMin);
                  }
               }
            }

            echo "</br><b><i>Folders includes:</i></b></br>";

            // Скопируем папки (Включения)
            foreach ($includes as $index => $path) {
               $pathArr = explode("/", $path);
               $pathCheckDir = $pathFrom;
               $pathMin = $pathIn;

               foreach ($pathArr as $indexPathEl => $pathEl) {
                  $pathMin .= "/" . $pathEl;
                  $pathCheckDir .= "/" . $pathEl;

                  if (is_dir($pathCheckDir)) {
                     echo $pathMin . "</br>";

                     if (!file_exists($pathMin)) {
                        mkdir($pathMin);
                     }
                  }
               }
            }

            echo "</br>";
            echo "<b><i>Files:</i></b></br>";

            // Скопируем файлы в минимальную версию
            foreach ($paths["files"] as $index => $path) {
               // Узнаем иссключение или нет
               $isException = isExceptionPath($path, $exceptions);

               // Если не является исключением, копируем
               if ($isException === false) {
                  $pathMin = toPathMin($pathIn, $path);

                  copyFile($path, $pathMin);

                  echo $pathMin . "</br>";
               }
            }

            echo "</br><b><i>Files includes:</i></b></br>";

            // Скопируем файлы в минимальную версию (Включения)
            foreach ($includes as $index => $path) {
               /**
                * Если передали путь до дирректории, значит копируем все файлы внутри,
                * но не рекурсивно
                */
               if (is_dir($pathFrom . "/" . $path)) {
                  $files = $require->pathFilesDir($pathFrom . "/" . $path);
                  $files = $files["files"];

                  foreach ($files as $indFile => $pathFile) {
                     $pathMin = toPathMin($pathIn, $pathFile);

                     copyFile($pathFile, $pathMin);

                     echo $pathMin . "</br>";
                  }
               } else {
                  $path = $pathFrom . "/" . $path;
                  $pathMin = toPathMin($pathIn, $path);

                  copyFile($path, $pathMin);

                  echo $pathMin . "</br>";
               }
            }
         };

         /**
          * Удалить дирректорию
          * @param {String} $path
          */
         function removeFolder($require, $path) {
            $paths = $require->pathFilesDir($path);

            // Удалим папки
            foreach ($paths["dirs"] as $index => $pathDir) {
               removeFolder($require, $pathDir);
            }

            // Удалим файлы
            foreach ($paths["files"] as $index => $pathFile) {
               unlink($pathFile);
            }

            rmdir($path);
         };

         // Подключим файлы необходимые для минимзации файлов
         $require->includeFiles(["min"]);

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

         $data = $query->data();
         $action = $data["action"];

         if ($action === "remove") {
            removeFolder($require, $pathIn);
         } elseif ($action === "clone") {
            cloneFolder($require, $pathFrom, $pathIn, $exceptions, $includes);
         }

         exit;
      }
   ]);
?>