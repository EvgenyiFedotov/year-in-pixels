<?php
   $templateParams["namesMonths"] = [
      "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"
   ];

   $templateParams["palette"] = [
      ["color" => "#e91e63", "note" => "Excited"],
      ["color" => "#f06292", "note" => "Good"],
      ["color" => "#ff5722", "note" => "Normal"],
      ["color" => "#ff9800", "note" => "Loving"],
      ["color" => "#ffeb3b", "note" => "Grateful"],
      ["color" => "#4caf50", "note" => "Nervous"],
      ["color" => "#03a9f4", "note" => "Sad"],
      ["color" => "#3f51b5", "note" => "Frustated"],
      ["color" => "#795548", "note" => "Exhausted"],
      ["color" => "#607d8b", "note" => "Bored"],
      ["color" => "#212121", "note" => "No date"]
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
      return "border: 1px solid " . $color . "; "
         . "background: repeating-linear-gradient(-45deg, white, white 5px, " . $color .  " 5px, " . $color .  " 10px);";
   };
?>