<?php
   include "Service/Librarys/NinjPhp/Table.php";
   include "Service/Librarys/Medoo/Medoo.php";
   include "Service/Librarys/NinjPhp/Connect.php";
   include "Service/Librarys/NinjPhp/Query.php";
   include "Service/Librarys/NinjPhp/RequireConfig.php";

   $config = new Config("Configs/Index.json");
   $users = new Table("Configs/Tables/users.json");
   $connect = new Connect("Configs/Connect.json");

   // Создать / удалить таблицу
   // $connect->query($users->sqlDrop());
   // $connect->query($users->sqlCreate());
   // echo "</br></br>";

   // Настроим приложение (Подключим конфиг и все необходимые файлы)
   $require = new RequireConfig("Configs/Index.json");

   // print_r($GLOBALS["queryresponse"]);

   echo "BEGIN";
   $query = new Query\Query();
   echo "</br></br>";

   // Проврим uri, чтобы корректно обработать запросы
   $query->checkUri();

   // Query\response("ALL", "^asd", function($require) {
   //    echo "ASD";
   // });

   // Запустим обработку запроса
   $query->run([
      "arguments" => [$require]
   ]);

   // echo "</br></br>";

   // print_r($connect->info());

// include "Service/Librarys/space-ninjphp/Ninjphp.php";

   // $app = new RequirePhp("Configs/Index.json");

   // // Обработка запроса
   // $query = new Query([
   //    "arguments" => [$app, $ninjphp]
   // ]);

   // // Настроим приложение
   // $app->setup();

   // // Запустим обработку запроса
   // $query->run();
?>