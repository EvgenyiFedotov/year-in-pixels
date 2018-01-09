<?php
   /**
    * Работа с событиями пользователя
    */
   class Event extends Object {
      /**
       * Подключение к БД
       * @cfg {Connect}
       */
      protected $connect;

      /**
       * Настроить конфиг
       * @param {stdClass} $params
       */
      protected function setupConfig ($params = null) {
         parent::setupConfig($params);

         // Настройка коннеста / таблиц и т.д.
         $this->connect = new Connect("Configs/Connect.json");
      }

      /**
       * Получить список событий
       * @param {Array} $filter
       */
      public function list ($filter = []) {
         // Настроим фильтры
         if (!isset($filter["begin"])) {
            $filter["begin"] = date("Y-m-d");
         }
         if (!isset($filter["end"])) {
            $filter["end"] = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d") + 1, date("Y")));
         }

         // Получим события
         $list = $this->connect->select("events", [
            "[>]events_time" => ["id" => "event"]
         ], [
            "events.id",
            "events.login",
            "events.type",
            "events.header",
            "events.note",
            "events_time.begin(begin)",
            "events_time.end(end)"
         ], [
            "begin[<]" => $filter["end"],
            "end[>]" => $filter["begin"],
            "ORDER" => ["id" => "DESC"]
         ]);

         // Рассчитаем тайм-лайн для событий
         $filter["begin"] = DateTime::createFromFormat("Y-m-d", $filter["begin"]);
         $filter["end"] = DateTime::createFromFormat("Y-m-d", $filter["end"]);

         $duration = $filter["end"]->getTimestamp() - $filter["begin"]->getTimestamp();

         foreach ($list as $index => $event) {
            if ($event["begin"]) {
               $begin = DateTime::createFromFormat("Y-m-d H:i:s", $event["begin"]);
               $left = ($begin->getTimestamp() - $filter["begin"]->getTimestamp()) / $duration * 100;

               $end = DateTime::createFromFormat("Y-m-d H:i:s", $event["end"]);
               $width = ($end->getTimestamp() - $begin->getTimestamp()) / $duration * 100;
            }

            $list[$index]["left"] = $left;
            $list[$index]["width"] = $width;
         }

         return $list;
      }
   }
?>