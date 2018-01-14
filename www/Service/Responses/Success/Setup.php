<?php
   /**
    * Настройка БД
    */
    Query\route("GET", "setup", function ($app, $query) {
      // Настроим коннект с БД
      $connect = new Connect("Configs/Connect.json");

      // Конфиги таблиц
      $tablePaths = $app->pathFilesDir("Configs/Tables");

      // Удалим и создадим таблицы
      foreach ($tablePaths["files"] as $index => $path) {
         $table = new Table($path);

         $connect->query($table->sqlDrop());
         $connect->query($table->sqlCreate());
      }

      exit;
   });
?>