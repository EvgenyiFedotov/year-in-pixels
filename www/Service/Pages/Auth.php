<?php
   // Если тема закэширована в сессии
   if (isset($_SESSION["theme"])) {
      $templateParams["theme"] = $_SESSION["theme"];
   }
?>