<?php
   namespace Query;

   include "Info.php";

   /**
    * Класс формирования ответов с сервера
    */
   class Response extends Info {
      /**
       * Сформировать корректный ответ с сервера
       * @param {Array|String} [$data]
       */
      public function response ($data = []) {
         // Если передали только сообщение
         if (is_string($data)) {
            $data = ["message"=> $data];
         }

         echo json_encode($data);

         exit;
      }

      /**
       * Отправить server-status
       * @param {Integer} [$status]
       * @param {String} [$message]
       */
      public function status ($status = 503, $message = null) {
         // Если не передали сообщение, поставим дефолтное
         if (!$message) {
            $message = $this->status[$status];
         }

         // Сфоримируем сообщение
         $message =$this->server()["SERVER_PROTOCOL"]. " " . $status ." " . $message;

         header($message, false, $status);
         exit;
      }
   }

   /**
    * Функция, позволяющая навесить обработчики на основной запрос
    * Не устанавливая их в параметрах конструтора запроса
    * Или при ручной вставке
    *
    * @param {String} $method
    * @param {String} $route
    * @param {Function} $callback
    * @param {Boolean} [$isError]
    */
   // function route($method, $route, $callback, $isError = false) {
   function route($m) {
      // echo "route " . $m . "</br>";

      // Если уже есть основной обработчик запроса
      // $query = $GLOBALS["query"];

      // if (isset($query)) {
      //    $query->addHandler($method, $route, [
      //       "callback" => $callback
      //    ], $isError);
      // } else {
      //    if (!isset($GLOBALS["queryresponse"])) {
      //       $GLOBALS["queryresponse"] = [];
      //    }

      //    $GLOBALS["queryresponse"][] = [$method, $route, [
      //       "callback" => $callback
      //    ], $isError];
      // }
   }
?>