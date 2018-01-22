<?php
   include_once("Protected/Days.php");

   class Days {
      /**
       * Записать данные по дню
       */
      public function write($query) {
         if ($query->method("POST")) {
            $data = $query->data();
            $pDays = new PDays();
            $login = $_SESSION["user"]["login"];

            $data["login"] = $login;

            $id = $pDays->write($data, [
               "date" => $data["date"],
               "login" => $login
            ]);

            $query->response([
               "id" => $id
            ]);
         }
      }

      public function list($query) {
         if ($query->method("GET")) {
            $pDays = new PDays();
            $query->response($pDays->list());
         }
      }
   }
?>