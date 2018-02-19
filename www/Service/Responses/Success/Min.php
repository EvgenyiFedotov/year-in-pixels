<?php
   /**
    * Минимизация файлов
    */
   Query\route([
      "route" => "min",
      "type" => "success",
      "priority" => 900,
      "handler" => function($require) {
         echo "<b>Min</b></br></br>";

         // Подключим файлы необходимые для минимзации файлов
         $require->includeFiles(["min"]);

         // Пути до файлов клиентской части
         $paths = $require->pathFilesDir("Client", true);

         // Создадим корневую папку минимизированных файлов
         if (!file_exists("../min")) {
            mkdir("../min");
         }

         if (!file_exists("../min/Client")) {
            mkdir("../min/Client");
         }

         // Склонируем папки в минимальную версию
         foreach ($paths["dirs"] as $key => $path) {
            $pathMin = "../min/" . $path;

            echo "</br>" . $pathMin;

            if (!file_exists($pathMin)) {
               mkdir($pathMin);
            }
         }

         exit;
      }
   ]);
?>