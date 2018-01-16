<?php
   /**
    * Настройка БД
    */
   Query\route([
      "route" => "setup",
      "type" => "success",
      "priority" => 1000,
      "handler" => function($require) {
         echo "<b>SETUP</b></br></br>";

         // Подключим файлы необходимые для работы с БД
         $require->includeFiles(["data-base"]);

         // Настроим коннект с БД
         $connect = new Connect("Configs/Connect.json");

         // Конфиги таблиц
         $tablePaths = $require->pathFilesDir("Configs/Tables");

         // Удалим и создадим таблицы
         foreach ($tablePaths["files"] as $index => $path) {
            $table = new Table($path);

            echo "Table: " . $table->name . "</br>";

            $connect->query($table->sqlDrop());
            $connect->query($table->sqlCreate());
         }

         exit;
      }
   ]);
?>