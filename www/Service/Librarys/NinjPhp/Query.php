<?php
   namespace Query;

   include "Query/Response.php";

   /**
    * Класс позволяющий обрабатывать запросы
    * Формировать ответы с сервера
    *
    * Можно добавить обработчики запросов и ошибкок при их обработке
    * Обработчики можно добавить как на определнный метод (GET|POST|...),
    * так и на все сразу просто передав "ALL" вместо определнного метода
    *
    *
    */
   class Query extends Response {
      /**
       * Роуты
       * @config {Array}
       * 
       * @config {Array} Element
       * @config {String} Element.route Регулярное выражение
       * @config {String} Element.method Метод запроса (POST|GET|PUT|DELETE)
       *    ! Если метод не указан, то обработчик будет применен к любому методу
       * @config {String} Element.type Тип обработчика,
       *    чтобы можно разграничить обработчики под разные нужды
       *    например обратка корректных запросов, обработка ошибок и т.д.
       *    По-умолчанию в классе Query используется 3 типа:
       *       1. success; 2. error; 3. service
       *    ! Если тип не указан, то обработчик будет применен к любому типу
       * @config {String|Function} Element.handler Путь до обработчика или сам обработчик
       * @config {Array} Element.arguments Агрументы,
       *    которые будут переданы именно в этот метод
       * @config {Number} Element.priority Приоритет выполенения
       */
      public $routes;

      /**
       * Аргументы, которые будут переданы в каждый обработчик
       */
      public $arguments;

      /**
       * Настроить конфиг
       * @param {stdClass} $params
       */
      protected function setupConfig ($params = []) {
         // Роуты
         if (!is_array($this->routes)) {
            $this->routes = [];
         }

         if (is_array($params["routes"])) {
            $this->routes = array_merge($this->routes, $params["routes"]);
         }

         // Глобальные роуты
         if (!isset($GLOBALS["routes"])) {
            $GLOBALS["routes"] = [];
         }

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
               // $this->error(404, true);
               echo $url;

            // Если запрос при загрузке страницы
            } elseif (file_exists($url)) {
               echo file_get_contents($url);
            }
         } else {
            $url = $this->requestUrl(true);

            $this->checkRoutes($url, "success");

            // Найдем обработчик url
            // $this->runByProp("handlers", $this->requestUrl(true));

            // Если не найден обработчик
            // $this->error(503, true);
         }
      }

      /**
       * Проверить роуты
       * @param {String} $url
       * @param {String} [$type]
       */
      protected function checkRoutes($url, $type = null) {
         $routes = $this->routes;
         $routesGlobal = $GLOBALS["routes"];
         $routesResult = [];

         // Пройдем по роутам и вычислим которые подходят
         foreach ($routes as $index => $configRoute) {
            if ($this->checkRoute($url, $configRoute, $type)) {
               echo "TRUE";
            }

            echo "</br>";
         }

         foreach ($routesGlobal as $index => $configRoute) {
            if ($this->checkRoute($url, $configRoute, $type)) {
               echo "TRUE";
            }

            echo "</br>";
         }
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

         print_r($configRoute);
         echo "</br>";

         // Подходит ли роут
         if ((!$configRoute["route"] || ($configRoute["route"] && $this->checkUrl($url, $configRoute["route"])))
         // Подходит ли метод
         && (!$configRoute["method"] || ($configRoute["method"] && $configRoute["method"] === $this->method()))
         // Подходит ли тип
         && (!$type || !$configRoute["type"] || ($type && $configRoute["type"] && $type === $configRoute["type"]))) {
            $result = true;
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
         preg_match($route, $url, $resultMatch);

         // Если роутер подходит, вернем результат поиска
         if (count($resultMatch) > 0) {
            return $resultMatch;
         } else {
            return null;
         }
      }
   }
?>