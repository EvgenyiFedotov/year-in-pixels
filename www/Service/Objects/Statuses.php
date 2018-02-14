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

            $this->createRecord("statuses", $data);
         } else {
            $query->error(503, "The entered data is incorrect!");
         }
      }

      /**
       * Обновить статус
       */
      public function update($query) {
         $data = $query->data();

         $this->updateRecord("statuses", [
            "color" => $data["color"],
            "note" => $data["note"]
         ], $data["id"]);
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