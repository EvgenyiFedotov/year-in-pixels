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
       * Убрать слэш из пути
       * @param {String} $path
       */
      public function shiftSlash($path) {
         $arrPath = explode("/", $path);
         array_shift($arrPath);
         return join("/", $arrPath);
      }

      /**
       * Получить путь запроса
       * @param {Boolean} $removeFirstSlash
       */
      public function requestUrl($removeFirstSlash = false) {
         $url = $this->server()["REDIRECT_URL"];

         if ($removeFirstSlash) {
            $url = $this->shiftSlash($url);
         }

         return $url;
      }

      /**
       * Получить путь относительно пути запроса
       * @param {String} $host
       */
      public function requestUrlByReferer($host) {
         $referer = $this->headers()["Referer"];
         $url = $this->requestUrl(true);

         $matches = [];
         preg_match_all('/.*' . $host . '\/(.*)/', $referer, $matches);

         $pathinfo = pathinfo($matches[1][0]);

         $dirname = $pathinfo["dirname"];

         if (substr($matches[1][0], -1) === "/") {
            $dirname .= "/" . $pathinfo["filename"];
         }

         if ($dirname) {
            $url = str_replace($dirname . "/", "", $url);
         }

         return $url;
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
       * Получить заголовки запроса
       */
      public function headers() {
         return apache_request_headers();
      }

      /**
       * Получить путь до объекта из заголовка
       * @return {Object}
       */
      public function pathToObject () {
         $headers = $this->headers();
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
         if ($this->method("GET")) {
            $data = $_GET;
         } else {
            parse_str(file_get_contents('php://input', false , null, -1 , $_SERVER['CONTENT_LENGTH'] ), $data);
         }

         return (array) $data;
      }

      /**
       * Получить данные в виде uri-строки
       */
      public function dataString () {
         return $this->server()["REDIRECT_QUERY_STRING"];
      }
   }
?>