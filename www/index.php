<?php
   include "Service/Librarys/NinjPhp/Query.php";
   include "Service/Librarys/NinjPhp/RequireConfig.php";

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // Обработка запроса
   $query = new Query\Query([
      "arguments" => [$require]
   ]);

   print_r($query->requestUrl());
   echo "</br>";
   echo $query->dataString();
   echo "</br>";
   print_r($query->data());
   echo "</br>";

   // Проврим uri, чтобы корректно обработать запросы
   // $query->checkUri();

   // Запустим обработку запроса
   // $query->run();
?>