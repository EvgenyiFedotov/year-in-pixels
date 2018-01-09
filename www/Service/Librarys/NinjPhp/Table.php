<?php
   include_once("Config.php");

   class Table extends Config {
      /**
       * @param {Array} $params
       */
      protected function setupConfig($params = []) {
         // Преобразуем настройки столбцов в массив
         $this->columns = (array) $this->columns;
      }

      /**
       * Получить SQL для созданий таблицы
       */
      public function sqlCreate() {
         if (count($this->columns)) {
            $sql = "CREATE TABLE " . $this->name . " (";

            $columns = array_map(function($configColumn, $nameColumn) {
               return "`" . $nameColumn . "` " . $configColumn;
            }, $this->columns, array_keys($this->columns));

            $sql .= join(", ", $columns) . ")";
         }

         return $sql;
      }

      /**
       * Получить sql удаления таблицы
       */
      function sqlDrop() {
         return "DROP TABLE " . $this->name;
      }
   }
?>