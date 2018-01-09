<?php
   include "Service/Librarys/space-ninjphp/Ninjphp.php";

   $app = new RequirePhp("Configs/Index.json");

   // Обработка запроса
   $query = new Query([
      "arguments" => [$app, $ninjphp]
   ]);

   // Настроим приложение
   $app->setup();

   // Проврим uri, чтобы корректно обработать запросы
   $query->checkUri();

   // Запустим обработку запроса
   $query->run();
?>