<?php
   include_once("Protected/Object.php");

   /**
    * Работа с статусами
    */
   class Statuses extends Object {
      /**
       * Получить список статусов
       * @param {Number|String} userId
       */
      public function listByUserId(...$args) {
         return $this->method(function($userId) {
            if (is_int($userId) || is_string($userId)) {
               $connect = $this->connect();

               return $connect->select("statuses", [
                  "id", "color", "note"
               ], [
                  "user_id" => $userId
               ]);
            } else {
               $this->noAccess();
            }
         }, $args);
      }
   }
?>