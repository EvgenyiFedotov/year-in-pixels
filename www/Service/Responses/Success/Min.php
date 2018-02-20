<?php
   use MatthiasMullie\Minify;

   /**
    * Минимизация файлов
    */
   Query\route([
      "route" => "min",
      "type" => "success",
      "priority" => 900,
      "handler" => function($require) {
         echo "<b>Min</b></br></br>";

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
               echo "!!!!";
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

         // Подключим файлы необходимые для минимзации файлов
         $require->includeFiles(["min"]);

         // Корень директории из которой переносим файлы
         $rootFrom = "Client";

         // Корень директории в которую переносим файлы
         $rootIn = "../Client.min";

         // Иссключения (Передаются как регулярные выражения)
         $exceptions = [
            "Librarys", ".*\.phtml", ".*\.less"
         ];

         // Включения (Передаются как регулярные выражения)
         $includes = [
            "Librarys/Require/Plugins"
         ];

         // Пути до файлов клиентской части
         $paths = $require->pathFilesDir("Client", true);

         // Создадим корневую папку минимизированных файлов
         if (!file_exists($rootIn)) {
            mkdir($rootIn);
         }

         echo "<b>Folders:</b>";

         // Склонируем папки в минимальную версию
         foreach ($paths["dirs"] as $key => $path) {
            // Узнаем иссключение или нет
            $isException = isExceptionPath($path, $exceptions);

            // Если не является исключением, копируем
            if ($isException === false) {
               $pathMin = toPathMin($rootIn, $path);
               echo "</br>" . $pathMin;

               if (!file_exists($pathMin)) {
                  mkdir($pathMin);
               }
            }
         }

         // Скопируем папки (Включения)
         foreach ($includes as $index => $path) {
            $pathArr = explode("/", $path);
            $pathMin = $rootIn;

            foreach ($pathArr as $indexPathEl => $pathEl) {
               $pathMin .= "/" . $pathEl;

               echo "</br>" . $pathMin;

               if (!file_exists($pathMin)) {
                  mkdir($pathMin);
               }
            }
         }

         echo "</br></br>";
         echo "<b>Files:</b></br>";

         // Скопируем файлы в минимальную версию
         foreach ($paths["files"] as $index => $path) {
            // Узнаем иссключение или нет
            $isException = isExceptionPath($path, $exceptions);

            // Если не является исключением, копируем
            if ($isException === false) {
               echo $path . "</br>";
            }
         }

         // Скопируем файлы в минимальную версию (Включения)
         foreach ($includes as $index => $path) {
            $files = $require->pathFilesDir($rootFrom . "/" . $path);
            $files = $files["files"];

            foreach ($files as $indFile => $pathFile) {
               copyFile($pathFile, toPathMin($rootIn, $pathFile));
            }
         }

         exit;
      }
   ]);
?>