<?php
   $data = $query->data();

   // Вычислим год или установим текущий
   $year = date("Y");
   if (isset($data["year"])) {
      $year = (int) $data["year"];
   }

   $templateParams["year"] = $year;

   $templateParams["namesMonths"] = [
      "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"
   ];

   $templateParams["palette"] = [
      ["color" => "#e91e63", "note" => "Excited", "status" => 0],
      ["color" => "#f06292", "note" => "Good", "status" => 1],
      ["color" => "#ff5722", "note" => "Normal", "status" => 2],
      ["color" => "#ff9800", "note" => "Loving", "status" => 3],
      ["color" => "#ffeb3b", "note" => "Grateful", "status" => 4],
      ["color" => "#4caf50", "note" => "Nervous", "status" => 5],
      ["color" => "#03a9f4", "note" => "Sad", "status" => 6],
      ["color" => "#3f51b5", "note" => "Frustated", "status" => 7],
      ["color" => "#795548", "note" => "Exhausted", "status" => 8],
      ["color" => "#607d8b", "note" => "Bored", "status" => 9],
      ["color" => "#212121", "note" => "No date", "status" => 10]
   ];
   $templateParams["paletteJSON"] = json_encode($templateParams["palette"]);

   $templateParams["getDate"] = function ($year, $month, $day) {
      if ($month < 10) {
         $month = "0" . $month;
      }

      if ($day < 10) {
         $day = "0" . $day;
      }

      return $year . "-" . $month . "-" . $day;
   };

   $templateParams["dayColor"] = function ($color) {
      if ($color) {
         return "border: 1px solid " . $color . "; "
            . "background-color: " . $color .  ";";
      } else {
         return "";
      }
   };

   // Загрузим статусы дней
   $require->includeFiles(["Object/Statuses.php"]);
   $statuses = new Statuses();
   $templateParams["statuses"] = $statuses->listByUserId($_SESSION["user"]["id"]);

   // Загрузим данные
   if (isset($_SESSION["user"])) {
      // Дни
      $require->includeFiles(["PObject/Days.php"]);
      $pDays = new PDays();
      $listDays = $pDays->list($_SESSION["user"]["login"], $year);
      $templateParams["days"] = json_encode($listDays);
      $templateParams["daysByDates"] = $pDays->listByDates($listDays);

      // Данные пользователя
      $connect = new Connect("Configs/Connect.json");
      $templateParams["user"] = $connect->get("users", [
         "login", "theme"
      ], [
         "id" => $_SESSION["user"]["id"]
      ]);

      $theme = $templateParams["user"]["theme"];
      $templateParams["theme"] = $theme;

      // Закэшируем название темы в сессию (чтобы на главно странице тоже подгружалась установленная тема)
      $_SESSION["theme"] = $theme;
   }
?>