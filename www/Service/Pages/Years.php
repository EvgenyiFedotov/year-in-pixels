<?php
   $data = $query->data();

   // Вычислим год или установим текущий
   $year = date("Y");
   if (isset($data["year"])) {
      $year = (int) $data["year"];
   }

   // Текущий год
   $templateParams["year"] = $year;

   // Заглавные буквы месяцев
   $templateParams["namesMonths"] = [
      "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"
   ];

   // Сформировать дату
   $templateParams["getDate"] = function ($year, $month, $day) {
      if ($month < 10) {
         $month = "0" . $month;
      }

      if ($day < 10) {
         $day = "0" . $day;
      }

      return $year . "-" . $month . "-" . $day;
   };

   // Получить стиль для маркера дня
   $templateParams["dayColor"] = function ($color) {
      if ($color) {
         return "border: 1px solid " . $color . "; " . "background-color: " . $color .  ";";
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