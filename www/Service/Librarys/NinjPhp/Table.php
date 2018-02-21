<?php
   include_once("Config.php");

   class Table extends Config {
      /**
       * @param {Array} $params
       */
      protected function setupConfig($params = []) {
         // Преобразуем настройки столбцов в массив
         $this->columns = (array) $this->columns;

         /**
          * Преобразуем настройки дополнительных столбцов в массив
          * Такие могу пригодится для дополнительной настроки таблицы
          */
         $this->columnsAdd = (array) $this->columnsAdd;
      }

      /**
       * Получить SQL для созданий таблицы
       */
      public function sqlCreate() {
         if (count($this->columns)) {
            $sql = "CREATE TABLE " . $this->name . " (";
            $columns = $this->columnsByStrings($this->columns);
            $sql .= join(", ", $columns) . ")";
         }

         return $sql;
      }

      /**
       * Получить sql удаления таблицы
       */
      public function sqlDrop() {
         return "DROP TABLE " . $this->name;
      }

      /**
       * Получить sql добавления столбцов
       */
      public function sqlColumnsAdd() {
         if (count($this->columnsAdd)) {
            $sql = "ALTER TABLE " . $this->name . " ADD ";
            $sql .= join(", ", $this->columnsByStrings($this->columnsAdd));
         }

         return $sql;
      }

      /**
       * Получить столбцы по строкам
       * @param {Array} $columns
       * @return {Array.<String>}
       */
      public function columnsByStrings($columns) {
         if (count($columns)) {
            return array_map(function($configColumn, $nameColumn) {
               return "`" . $nameColumn . "` " . $configColumn;
            }, $columns, array_keys($columns));
         }
      }
   }
?>