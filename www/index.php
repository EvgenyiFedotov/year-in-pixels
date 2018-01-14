<?php
   include "Service/Librarys/NinjPhp/Query.php";
   include "Service/Librarys/NinjPhp/RequireConfig.php";

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // Обработка запроса
   $query = new Query\Query([
      "arguments" => [$require]
   ]);

   // Вычислим откуда было обращение
   $headers = $query->headers();

   // Если уже ьбыла переадресация, обработаем запрашиваемый путь
   if ($headers["Referer"]) {
      $url = $query->requestUrlByReferer("year-in-pixels");

      header("Content-Type: " . $headers["Accept"]);

      // Если дополнительный запрос от клиента (ajax)
      if ($headers["X-Requested-With"]) {
         $query->error(404, true);

      // Если запрос при загрузке страницы
      } elseif (file_exists($url)) {
         echo file_get_contents($url);
      }
   } else {
      // Проврим url, чтобы корректно обработать запросы
      // $query->checkUrl();
   
      // Запустим обработку запроса
      $query->run();
   }
?>