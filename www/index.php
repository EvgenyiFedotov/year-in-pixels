<?php
   include "Service/Librarys/NinjPhp/Table.php";
   include "Service/Librarys/Medoo/Medoo.php";
   include "Service/Librarys/NinjPhp/Connect.php";

   $config = new Config("Configs/Index.json");
   $users = new Table("Configs/Tables/users.json");
   $connect = new Connect("Configs/Connect.json");

   echo $users->sqlCreate();
   echo "</br></br>";

   $connect->query($users->sqlDrop());
   $connect->query($users->sqlCreate());
   // print_r($connect->info());

// include "Service/Librarys/space-ninjphp/Ninjphp.php";

   // $app = new RequirePhp("Configs/Index.json");

   // // Обработка запроса
   // $query = new Query([
   //    "arguments" => [$app, $ninjphp]
   // ]);

   // // Настроим приложение
   // $app->setup();

   // // Проврим uri, чтобы корректно обработать запросы
   // $query->checkUri();

   // // Запустим обработку запроса
   // $query->run();
?>