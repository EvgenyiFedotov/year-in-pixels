<?php
   class PDays {
      /**
       * Получить коннект с БД
       */
      public function connect() {
         return new Connect("Configs/Connect.json");
      }

      /**
       * Записть (перезаписать) данные о дне
       * @param {Array} $data
       * @param {Array} $where
       */
      public function write($data, $where = []) {
         $connect = $this->connect();

         if (count($where)) {
            $connect->update("days", $data, $where);
         } else {
            $connect->insert("days", $data);
         }

         return $connect->id();
      }

      /**
       * Проверить есть запись дня
       * @param {String} $date YYYY-MM-DD HH:MM:SS
       */
      public function has($date) {
         $connect = $this->connect();

         $result = $connect->get("days", ["id"], [
            "date" => $date
         ]);

         return $result["id"];
      }

      /**
       * Список дней
       */
      public function list() {
         $connect = $this->connect();
         return $connect->select("days", '*');
      }

      /**
       * Список дней где ключи даты формата YYYY-MM-DD
       * @param {Array} $list
       */
      public function listByDates($list) {
         return array_reduce($list, function($result, $value) {
            $result[explode(" ", $value["date"])[0]] = $value;
            return $result;
         }, []);
      }
   }
?>