<?php
   class Object {
      /**
       * Получить коннект с БД
       */
      protected function connect() {
         return new Connect("Configs/Connect.json");
      }

      /**
       * Записать перезаписать данные строки (записи)
       * @param {String} $nameTable
       * @param {Array} $data
       * @param {Array} [$where]
       */
      public function writeRow($nameTable, $data, $where = []) {
         $connect = $this->connect();
         $id = $this->hasRow($nameTable, $where);

         // Если запись существует, обновим ее, иначе просто запишем в БД
         if ($id) {
            $connect->update($nameTable, $data, $where);
            return $id;
         } else {
            $connect->insert($nameTable, $data);
            return $connect->id();
         }
      }

      /**
       * Проверить сущуствует ли строка (запись)
       * Внимание! В талиблице должно быть поле "id"s
       * @param {String} $nameTable
       * @param {Array} $where
       */
      public function hasRow($nameTable, $where) {
         if (count($where)) {
            $connect = $this->connect();
            $result = $connect->get($nameTable, ["id"], $where);
            return $result["id"];
         } else {
            return null;
         }
      }
   }
?>