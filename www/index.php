<?php
   session_start();

   include "Service/Librarys/NinjPhp/RequireConfig.php";
   include "Service/Librarys/NinjPhp/Query.php";

   // Вклчючить (-1) / отключить (0) логирование ошибок
   // error_reporting(0);

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // Обработка запроса
   $query = new Query\Query([
      "arguments" => [$require]
   ]);

   set_error_handler(function() {
      $query = new Query\Query();
      $query->error(503);
   });

   // Запустим обработку запроса
   $query->autoResponse();
?>