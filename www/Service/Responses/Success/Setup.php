<?php
   /**
    * Настройка БД
    */
    Query\response("GET", "setup", function ($app, $ninjphp, $query) {
      // Подключим модуль для работы с БД
      $ninjphp->including(["data-base"]);

      // Настроим коннект с БД
      $connect = new Connect("Configs/Connect.json");

      exit;
   });
?>