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

      /**
       * Обработка методов, для проверки доступа
       * Обердтка позваляющяя выкинуть корректное исключение при вызове
       * "Приватного для пользователя" метода
       * @param {Function} $method
       * @param {Array} $args
       */
      public function method($method, $args = []) {
         try {
            if (is_callable($method)) {
               return call_user_func_array($method, $args);
            } else {
               $this->noAccess();
            }

         // Если выбрашено исключение значит нет доступа
         } catch (Exception $e) {
            $query = new Query\Query();
            $query->error(404, $e->getMessage());
         }
      }

      /**
       * Запустить исключение поступа
       */
      public function noAccess() {
         throw new Exception('No access!');
      }
   }
?>