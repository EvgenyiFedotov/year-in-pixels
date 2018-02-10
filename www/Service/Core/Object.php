<?php
   class Object {
      /**
       * Коннеест
       * @config {Connect}
       */
      private $connect;

      /**
       * Получить коннект с БД
       */
      protected function connect() {
         if (!$this->connect) {
            $this->connect = new Connect("Configs/Connect.json");
         }

         return $this->connect;
      }

      /**
       * Ошибка выполнения
       */
      protected function error() {
         $query = new Query\Query();
         $query->error(503, true);
      }
   }
?>