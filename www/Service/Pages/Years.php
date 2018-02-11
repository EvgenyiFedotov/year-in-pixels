<?php
   $data = $query->data();

   // Параметры, которые необходимо передать на клиент
   $loadParams = [];

   // Данные пользователя
   $dataUser = $_SESSION["user"];

   // Загрузим статусы дней
   $require->includeFiles(["Object/Statuses.php"]);
   $statuses = new Statuses();
   $loadParams["statuses"] = $statuses->listByUserId($dataUser["id"]);

   // Данные пользователя
   $connect = new Connect("Configs/Connect.json");
   $loadParams["user"] = $connect->get("users", [
      "login", "theme"
   ], [
      "id" => $_SESSION["user"]["id"]
   ]);

   $templateParams["theme"] = $loadParams["user"]["theme"];
   // Закэшируем название темы в сессию (чтобы на главно странице тоже подгружалась установленная тема)
   $_SESSION["theme"] = $loadParams["user"]["theme"];

   // // Загрузим данные
   // if (isset($_SESSION["user"])) {
   //    // Вычислим год или установим текущий
   //    $year = date("Y");
   //    if (isset($data["year"])) {
   //       $year = (int) $data["year"];
   //    }

   //    // Дни
   //    $require->includeFiles(["PObject/Days.php"]);
   //    $pDays = new PDays();
   //    $listDays = $pDays->list($_SESSION["user"]["login"], $year);
   //    $loadParams["days"] = $listDays;
   //    $templateParams["daysByDates"] = $pDays->listByDates($listDays);


   //    $templateParams["theme"] = $loadParams["user"]["theme"];

   //    // Закэшируем название темы в сессию (чтобы на главно странице тоже подгружалась установленная тема)
   //    $_SESSION["theme"] = $loadParams["user"]["theme"];
   // }

   $templateParams["loadParams"] = $loadParams;
?>