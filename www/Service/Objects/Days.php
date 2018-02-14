<?php
   include_once("Service/Core/Object.php");

   class Days extends Object {
      /**
       * Получить список дней по идентификатору пользователя
       * @param {String|Number} $user_id
       * @param {}
       */
      public function listByUserId($user_id) {
         if (is_int($user_id) || is_string($user_id)) {
            $connect = $this->connect();

            return $connect->select("days", [
               "id", "date", "status_id", "note"
            ], [
               "user_id" => $user_id
            ]);
         } else {
            $this->error();
         }
      }

      /**
       * Создать / записать модель дня
       */
      public function create($query) {
         // Настройка данных
         $data = $query->data();
         $data = [
            "user_id" => $data["user_id"] || $_SESSION["user"]["id"],
            "date" => $data["dateSQL"],
            "status_id" => $data["status_id"],
            "note" => $data["note"]
         ];

         // Запишим данные
         $this->createRecord("days", $data);
      }

      /**
       * Обновить запись дня
       */
      public function update($query) {
         $data = $query->data();

         $this->updateRecord("days", [
            "status_id" => $data["status_id"],
            "note" => $data["note"],
            "date" => $data["dateSQL"]
         ], $data["id"]);
      }
   }
?>