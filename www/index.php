<?php
   include "Service/Librarys/NinjPhp/Table.php";
   include "Service/Librarys/Medoo/Medoo.php";
   include "Service/Librarys/NinjPhp/Connect.php";
   include "Service/Librarys/NinjPhp/Query.php";

   $config = new Config("Configs/Index.json");
   $users = new Table("Configs/Tables/users.json");
   $connect = new Connect("Configs/Connect.json");

   // Создать / удалить таблицу
   // $connect->query($users->sqlDrop());
   // $connect->query($users->sqlCreate());
   // echo "</br></br>";

   echo "BEGIN";
   $query = new Query\Query();
   echo "</br></br>";

   // Проврим uri, чтобы корректно обработать запросы
   $query->checkUri();

   Query\response("ALL", "^asd", function() {
      echo "asd";
   });
   Query\response("ALL", "", function() {
      echo "aaa";
   });

   // Запустим обработку запроса
   $query->run();

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