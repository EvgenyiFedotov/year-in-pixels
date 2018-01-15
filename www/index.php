<?php
   include "Service/Librarys/NinjPhp/Query.php";
   include "Service/Librarys/NinjPhp/RequireConfig.php";

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // Обработка запроса
   $query = new Query\Query([
      // "arguments" => [$require]
      "arguments" => ["All"]
   ]);

   // Запустим обработку запроса
   $query->autoResponse();

   // Запустим обработку запроса
   // $query->run();
?>