<?php
   namespace Query;

   include "Base.php";

   /**
    * Класс получения информации о запросе
    */
   class Info extends Base {
      /**
       * Получить переменную $_SERVER
       */
      public function server () {
         return $_SERVER;
      }

      /**
       * Получить путь запроса
       */
      public function requestUrl() {
         return $this->server()["REDIRECT_URL"];
      }

      /**
       * Получить route
       * Похоже на uri, только отфильтрованы параметры
       */
      public function route () {
         $uri = explode("?", $this->server()["REQUEST_URI"])[0];
         $uri = join(array_filter(explode("/", $uri)), "/");

         if ($uri === "" || $uri === "/") {
            return null;
         } else {
            return $uri;
         }
      }

      /**
       * Получить метод / проверить название метода, если передали значение
       * @param {String} $name
       */
      public function method ($name = null) {
         $method = $this->server()["REQUEST_METHOD"];

         if (isset($name)) {
            return $name === $method;
         } else {
            return $method;
         }
      }

      /**
       * Получить путь до объекта из заголовка
       * @return {Object}
       */
      public function pathToObject () {
         $headers = apache_request_headers();
         $method = $headers["Method"];

         if ($method) {
            $method = explode(".", $method);

            return [
               "object" => $method[0],
               "method" => $method[1]
            ];
         }
      }

      /**
       * Получить входящие данные
       */
      public function data () {
         $data = json_decode(file_get_contents("php://input"));

         if (!$data) {
            $data = (object) $_GET;
         }

         return $data;
      }

      /**
       * Получить данные в виде uri-строки
       */
      public function dataString () {
         return $this->server()["REDIRECT_QUERY_STRING"];
      }
   }
?>