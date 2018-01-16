<?php
   class Days {
      public function Write($query) {
         if ($query->method("POST")) {
            $connect = new Connect("Configs/Connect.json");

            $data = $query->data();

            $connect->insert("days", [
               "date" => $data["date"],
               "status" => $data["status"]
            ]);
            
            $query->response([
               "id" => $connect->id()
            ]);
         }
      }

      public function List($query) {
         if ($query->method("GET")) {
            $connect = new Connect("Configs/Connect.json");
            $list = $connect->select("days", '*');
            $query->response($list);
         }
      }
   }
?>