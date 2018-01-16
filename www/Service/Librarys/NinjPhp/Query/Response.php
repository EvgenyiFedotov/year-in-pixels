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
            $message = $this->statusList[$status];
         }

         // Сфоримируем сообщение
         $message = $this->server()["SERVER_PROTOCOL"]. " " . $status ." " . $message;

         header($message, false, $status);
         exit;
      }
   }
?>