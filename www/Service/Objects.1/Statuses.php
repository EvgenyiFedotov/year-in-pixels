<?php
   include_once("Service/Core/Object.php");

   /**
    * Работа с статусами
    */
   class Statuses extends Object {
      /**
       * Получить список статусов
       * @param {Number|String} userId
       */
      public function listByUserId($userId) {
         if (is_int($userId) || is_string($userId)) {
            $connect = $this->connect();

            return $connect->select("statuses", [
               "id", "color", "note"
            ], [
               "user_id" => $userId
            ]);
         } else {
            $this->error();
         }
      }

      /**
       * Создать / записать статус
       */
      public function create($query) {
         $connect = $this->connect();

         // Настройка данных
         $data = $query->data();
         $data = [
            "user_id" => $_SESSION["user"]["id"],
            "color" => $data["color"],
            "note" => $data["note"]
         ];

         $result = $connect->insert("statuses", $data);

         if ($result->rowCount()) {
            $data["id"] = $connect->id();
            $query->response($data);
         } else {
            $query->error(503, true);
         }
      }
   }
?>