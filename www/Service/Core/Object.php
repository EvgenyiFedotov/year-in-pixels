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

      /**
       * Создать запись в таблицы
       * @param {String} $nameTable
       * @param {Array} $data
       * @param {String} $namePrimaryKey
       */
      protected function createRecord($nameTable, $data, $namePrimaryKey = "id") {
         $connect = $this->connect();
         $query = $this->query();
         $result = $connect->insert($nameTable, $data);

         if ($result->rowCount()) {
            $data[$namePrimaryKey] = $connect->id();
            $query->response($data);
         } else {
            $query->error(503, true);
         }
      }

      /**
       * Обновить запись таблицы
       * @param {String} $nameTable
       * @param {Array} $data
       * @param {String|Nunmber} $id
       * @param {String} $namePrimaryKey
       */
      protected function updateRecord($nameTable, $data, $id, $namePrimaryKey = "id") {
         $connect = $this->connect();
         $query = $this->query();

         $where = [];
         $where[$namePrimaryKey] = $id;

         $result = $connect->update($nameTable, $data, $where);

         if ($result->rowCount()) {
            $query->response($data);
         } else {
            $query->error(503, true);
         }
      }
   }
?>