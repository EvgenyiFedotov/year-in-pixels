<?php
   /**
    * Настройка БД
    */
   response("GET", "setup", function ($app, $ninjphp, $query) {
      // Подключим модуль для работы с БД
      $ninjphp->including(["data-base"]);

      // Настроим коннект с БД
      $connect = new Connect("Configs/Connect.json");

      // Инстансы таблиц
      $tables = [
         "Users" => null,
         "Events" => null,
         "EventsTime" => null
      ];

      // Пройдем по таблицам и пересоздадим их
      foreach ($tables as $key => $value) {
         $pathConfig = "Configs/Tables/" . $key . ".json";
         $tables[$key] = new TableConnect($pathConfig, (object) [
            "connect" => $connect
         ]);

         $tables[$key]->delete();
         $tables[$key]->create();
      }

      // Вставим тестовые данные
      $events = [];
      for ($index = 1; $index < 80; $index ++) {
         $events[] = [
            "login" => "demo",
            "header" => "Header " . $index,
            "note" => "note " . $index
         ];
      }

      $connect->insert("events", $events);

      print_r($connect->select("events", "*"));
      echo "<br/><br/>";

      $eventsTime = [];
      for ($index = 2; $index < 6; $index++) {
         $eventsTime[] = [
            "event" => $index,
            "begin" => "2017-01-01 00:00:00",
            "end" => "2017-10-01 00:00:00"
         ];
      }
      for ($index = 33; $index < 55; $index++) {
         $eventsTime[] = [
            "event" => $index,
            "begin" => "2017-08-01 00:00:00",
            "end" => "2017-09-01 00:00:00"
         ];
      }
      for ($index = 55; $index < 80; $index++) {
         $eventsTime[] = [
            "event" => $index,
            "begin" => "2017-09-01 00:00:00",
            "end" => "2017-12-31 00:00:00"
         ];
      }

      $connect->insert("events_time", $eventsTime);

      print_r($connect->select("events_time", "*"));
      echo "<br/><br/>";
   });
?>