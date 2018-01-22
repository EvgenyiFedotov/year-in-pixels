<?php
   include_once("Object.php");

   class PDays extends Object {

      /**
       * Записть (перезаписать) данные о дне
       * @param {Array} $data
       * @param {Array} [$where]
       */
      public function write($data, $where = []) {
         return $this->writeRow("days", $data, $where);
      }

      /**
       * Проверить есть запись дня
       * @param {String} $date YYYY-MM-DD HH:MM:SS
       */
      public function has($date) {
         return $this->hasRow("days", [
            "date" => $date
         ]);
      }

      /**
       * Список дней за год для пользователя
       * @param {String} $login
       * @param {Number} [$year]
       */
      public function list($login, $year = null) {
         $connect = $this->connect();

         if (!isset($year)) {
            $year = date("Y");
         }

         return $connect->select("days", "*", [
            "login" => $login,
            "date[>=]" => date("Y-m-d", mktime(0, 0, 0, 0, 0, $year)),
            "date[<]" => date("Y-m-d", mktime(0, 0, 0, 0, 0, $year + 1))
         ]);
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