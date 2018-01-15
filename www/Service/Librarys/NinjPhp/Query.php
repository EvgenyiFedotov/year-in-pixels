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
            foreach ($routesResult as $index => $configRoute) {
               echo $configRoute["configRoute"]["route"] . "</br>";
               echo $configRoute["configRoute"]["priority"] . "</br>";

               echo "</br>";
            }
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
         preg_match($route, $url, $resultMatch);

         // Если роутер подходит, вернем результат поиска
         if (count($resultMatch) > 0) {
            return $resultMatch;
         } else {
            return null;
         }
      }
   }

   /**
    * Функция, позволяющая навесить обработчики на основной запрос
    * Не устанавливая их в параметрах конструтора запроса
    * Или при ручной вставке
    *
    * @config {Array} Route
    * @config {String} Route.route Регулярное выражение
    * @config {String} Route.method Метод запроса (POST|GET|PUT|DELETE)
    *    ! Если метод не указан, то обработчик будет применен к любому методу
    * @config {String} Route.type Тип обработчика,
    *    чтобы можно разграничить обработчики под разные нужды
    *    например обратка корректных запросов, обработка ошибок и т.д.
    *    По-умолчанию в классе Query используется 3 типа:
    *       1. success; 2. error; 3. service
    *    ! Если тип не указан, то обработчик будет применен к любому типу
    * @config {Function} Route.handler Обработчик
    * @config {Array} Route.arguments Агрументы,
    *    которые будут переданы именно в этот метод
    * @config {Number} Route.priority Приоритет выполенения
    */
   // function route($method, $route, $callback, $isError = false) {
   function route($route) {
      // Создадим глобальный массив роутов
      if (!isset($GLOBALS["routes"])) {
         $GLOBALS["routes"] = [];
      }

      $GLOBALS["routes"][] = (array) $route;
   }
?>