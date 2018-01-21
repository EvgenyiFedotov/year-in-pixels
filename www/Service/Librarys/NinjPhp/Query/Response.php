<?php
   namespace Query;

   include "Info.php";

   /**
    * Класс формирования ответов с сервера
    */
   class Response extends Info {
      /**
       * Получить протокол
       */
      public function protocol() {
         $server = $this->server();
         return $protocol = isset($server['SERVER_PROTOCOL']) ? $server['SERVER_PROTOCOL'] : 'HTTP/1.0';
      }

      /**
       * Сформировать корректный ответ с сервера
       * @param {Array|String} [$data]
       */
      public function response($data = [], $message = null) {
         // Если передали только сообщение
         if (is_string($data)) {
            $data = ["message"=> $data];
         }

         echo json_encode($data);

         // Если передали сообщение
         if (isset($message)) {
            $this->status(200, $message);
         }

         exit;
      }

      /**
       * Отправить server-status
       * @param {Integer} [$status]
       * @param {String} [$message]
       */
      public function status($status = 503, $message = null) {
         // Если не передали сообщение, поставим дефолтное
         if (!$message) {
            $message = $this->statusList[$status];
         }

         // Сфоримируем сообщение
         $message = $this->protocol() . " " . $status ." " . $message;

         header($message, false, $status);
         exit;
      }
   }
?>