<?php
   include_once("Service/Core/Object.php");

   /**
    * Работа с статусами
    */
   class Statuses extends Object {
      /**
       * Получить список статусов
       * @param {Number|String} $userId
       * @param {Number|Boolean} $isDelete
       *    Если укзали -1, то подгрузим все статусы
       */
      public function listByUserId($userId, $isDelete = 0) {
         if (is_int($userId) || is_string($userId)) {
            $connect = $this->connect();

            $where = [
               "user_id" => $userId
            ];

            if ($isDelete !== -1) {
               $where["is_delete"] = $isDelete;
            }

            return $connect->select("statuses", [
               "id", "color", "note", "is_delete"
            ], $where);
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