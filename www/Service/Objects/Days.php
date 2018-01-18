<?php
   include_once("Protected/Days.php");

   class Days {
      public function write($query) {
         if ($query->method("POST")) {
            $pDays = new PDays();
            $data = $query->data();

            // Проверим, может уже существует запись
            $id = $pDays->has($data["date"]);

            if ($id) {
               $pDays->write($data, [
                  "date" => $data["date"]
               ]);
            } else {
               $id = $pDays->write($data);
            }

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