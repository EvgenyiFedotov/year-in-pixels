<?php
   session_start();

   include "Service/Librarys/NinjPhp/RequireConfig.php";
   include "Service/Librarys/NinjPhp/Query.php";

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // Обработка запроса
   $query = new Query\Query([
      "arguments" => [$require]
   ]);

   // unset($_SESSION["user"]);

   // Запустим обработку запроса
   $query->autoResponse();
?>