<?php
   namespace Query;

   include "Query/Response.php";
   include "Query/Route.php";

   /**
    * Класс позволяющий обрабатывать запросы
    * Формировать ответы с сервера
    *
    * Можно добавить обработчики запросов и ошибкок при их обработке
    * Обработчики можно добавить как на определнный метод (GET|POST|...),
    * так и на все сразу просто передав "ALL" вместо определнного метода
    */
   class Query extends Response {
      /**
       * Аргументы, которые будут переданы в каждый обработчик
       */
      public $arguments;

      /**
       * Настроить конфиг
       * @param {stdClass} $params
       */
      protected function setupConfig ($params = []) {
         // Аргументы
         if (!is_array($this->arguments)) {
            $this->arguments = [];
         }

         if (is_array($params["arguments"])) {
            $this->arguments = array_merge($this->arguments, $params["arguments"]);
         }
      }

      /**
       * Автоматический ответ
       * С анализом url, запуском обработчиков
       */
      public function autoResponse() {
         // Вычислим откуда было обращение
         $headers = $this->headers();

         // Если уже ьбыла переадресация, обработаем запрашиваемый путь
         if ($headers["Referer"]) {
            $url = $this->requestUrlByReferer("year-in-pixels");

            header("Content-Type: " . $headers["Accept"]);

            // Если дополнительный запрос от клиента (ajax)
            if ($headers["X-Requested-With"]) {
               if (!$this->service($url)) {
                  $this->error(503, true);
               }

            // Если запрос при загрузке страницы
            } elseif (file_exists($url)) {
               echo file_get_contents($url);

            // Если не нашли файл
            } else {
               // Пока ничего не будем выдавать
               // $this->error(503, true);
            }
         } else {
            /**
             * Найдем обработчик url
             * Если обработчик не найден отдадим ошибку
             */
            if (!$this->success($this->requestUrl(true), "success")) {
               $this->error(503, true);
            }
         }
      }

      /**
       * Проверить success-роуты
       * @param {String} $url
       */
      public function success($url) {
         return $this->checkRoutes($url, "success");
      }

      /**
       * Проверить error-роуты
       * @param {String|Number} $url
       * @param {Boolean} $status Отправлять ли статус
       */
      public function error($url, $status = false) {
         $result = $this->checkRoutes((string) $url, "error");

         // Если необходимо отправить статус
         if ($status) {
            $this->status($url);
         }

         return $result;
      }

      /**
       * Проверить service-роуты
       * @param {String} $url
       */
      public function service($url) {
         return $this->checkRoutes($url, "service");
      }

      /**
       * Проверить роуты
       * @param {String} $url
       * @param {String} [$type]
       * @return {Boolean}
       */
      protected function checkRoutes($url, $type = null) {
         $routes = (array) $GLOBALS["routes"];
         $routesResult = [];

         // Пройдем по роутам и вычислим которые подходят
         foreach ($routes as $index => $configRoute) {
            $checkResult = $this->checkRoute($url, $configRoute, $type);

            if (is_callable($configRoute["handler"]) && $checkResult) {
               $routesResult[] = [
                  "configRoute" => $configRoute,
                  "checkResult" => $checkResult
               ];
            }
         }

         if (count($routesResult)) {
            // Отсортируем роутеры по приоритету
            uasort($routesResult, function($a, $b) {
               $aPriority = $a["configRoute"]["priority"];
               $bPriority = $b["configRoute"]["priority"];

               if ($aPriority == $bPriority) {
                  return 0;
               }

               return ($aPriority < $bPriority) ? 1 : -1;
            });

            // Пройдем по корректным роутерам
            foreach ($routesResult as $index => $route) {
               $configRoute = $route["configRoute"];

               // Аргументы обработчика
               $arguments = $configRoute["arguments"];

               if (!is_array($arguments)) {
                  $arguments = [];
               }

               // Добавим общие (обязательные аргументы)
               $arguments = array_merge($this->arguments, $arguments);

               // Добавим резутаты парсинга роутера, т.к. там пишится регулярка
               $arguments[] = $route["checkResult"]["route"];

               // Добавим настройки самого роутинга
               $arguments[] = $configRoute;

               // Добавим в аргуементы инстанс текщего запроса
               $arguments[] = $this;

               // Вызовов обработчика
               call_user_func_array($configRoute["handler"], $arguments);
            }

            return true;
         }

         return false;
      }

      /**
       * Проверить роут
       * @param {String} $url
       * @param {Array} $configRoute
       * @return {Boolean}
       */
      protected function checkRoute($url, $configRoute, $type = null) {
         $configRoute = (array) $configRoute;
         $result = false;
         $check = [
            // Подходит ли роут
            "route" => $configRoute["route"]
               ? $this->checkUrl($url, $configRoute["route"])
               : true,

            // Подходит ли метод
            "method" => $configRoute["method"]
               ? $configRoute["method"] === $this->method()
               : true,

            // Подходит ли тип
            "type" => !$type
               || !$configRoute["type"]
               || ($type && $configRoute["type"] && $type === $configRoute["type"])
         ];

         if ($check["route"] && $check["method"] && $check["type"]) {
            $result = $check;
         }

         return $result;
      }

      /**
       * Проверить url
       * @param {String} $url
       * @param {String} $route
       * @return {Boolean}
       */
      protected function checkUrl($url, $route) {
         $resultMatch = [];
         preg_match("/" . $route . "/", $url, $resultMatch);

         // Если роутер подходит, вернем результат поиска
         if (count($resultMatch) > 0) {
            return $resultMatch;
         } else {
            return null;
         }
      }
   }
?>