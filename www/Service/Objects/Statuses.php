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
               "user_id" => $userId,
               "is_delete" => 0
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
         $color = $data["color"];
         $note = $data["note"];

         if (isset($color) && $color !== ""
         && isset($note) && $note !== "") {
            $data = [
               "user_id" => $_SESSION["user"]["id"],
               "color" => $color,
               "note" => $note
            ];

            $result = $connect->insert("statuses", $data);

            if ($result->rowCount()) {
               $data["id"] = $connect->id();
               $query->response($data);
            } else {
               $query->error(503, true);
            }
         } else {
            $query->error(503, "The entered data is incorrect!");
         }
      }

      /**
       * Обновить статус
       */
      public function update($query) {
         $connect = $this->connect();

         $data = $query->data();

         $result = $connect->update("statuses", [
            "color" => $data["color"],
            "note" => $data["note"]
         ], [
            "id" => $data["id"]
         ]);

         if ($result->rowCount()) {
            $query->response($data);
         } else {
            $query->error(503, true);
         }
      }

      /**
       * Удалить статус
       */
      public function delete($query) {
         $connect = $this->connect();
         $data = $query->data();
         $id = $data["id"];

         $result = $connect->update("statuses", [
            "is_delete" => 1
         ], [
            "id" => $id
         ]);

         if ($result->rowCount()) {
            $query->response([
               "id" => $id
            ]);
         } else {
            $query->error(503, true);
         }
      }
   }
?>