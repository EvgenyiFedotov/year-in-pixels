<?php
   $data = $query->data();

   // Параметры, которые необходимо передать на клиент
   $loadParams = [];

   // Данные пользователя
   $dataUser = $_SESSION["user"];
   $connect = new Connect("Configs/Connect.json");
   $loadParams["user"] = $connect->get("users", [
      "login", "theme"
   ], [
      "id" => $dataUser["id"]
   ]);

   // Закэшируем название темы в сессию (чтобы на главно странице тоже подгружалась установленная тема)
   $_SESSION["theme"] = $loadParams["user"]["theme"];

   // Загрузим статусы дней
   $require->includeFiles(["Object/Statuses.php"]);
   $statuses = new Statuses();
   $loadParams["statuses"] = $statuses->listByUserId($dataUser["id"]);

   // Загрузим список дней
   $require->includeFiles(["Object/Days.php"]);
   $days = new Days();
   $loadParams["days"] = $days->listByUserId($dataUser["id"]);

   $templateParams["theme"] = $loadParams["user"]["theme"];
   $templateParams["loadParams"] = $loadParams;
?>