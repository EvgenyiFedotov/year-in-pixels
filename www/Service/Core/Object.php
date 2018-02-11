<?php
   class Object {
      /**
       * Коннект
       * @config {Connect}
       */
      private $connect;

      /**
       * Объект запроса
       */
      private $query;

      /**
       * Получить коннект с БД
       */
      protected function connect() {
         if (!$this->connect) {
            $this->connect = new Connect("Configs/Connect.json");
         }

         return $this->connect;
      }

      protected function query() {
         if (!$this->query) {
            $this->query = new Query\Query();
         }

         return $this->query;
      }

      /**
       * Ошибка выполнения
       */
      protected function error() {
         $query = $this->query();
         $query->error(503, true);
      }
   }
?>