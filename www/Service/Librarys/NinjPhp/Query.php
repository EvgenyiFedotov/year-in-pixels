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
       * Список обработчиков запросов
       * @cfg {Array}
       */
      protected $handlers;

      /**
       * Список обработчиков запросов
       * Можно указать ключ -1, чтобы для назначить обработчик для любой ошибки
       * Причем он вызвется перед основным обработчиком ошибки
       * @cfg {Array}
       */
      protected $handlersErrors;

      /**
       * Аргументы, которые будут переданы в каждый обработчик
       * @cfg {Array}
       */
      protected $arguments;

      /**
       * Является ли обработчик запроса основным
       * Если да, то запишим его в $GLOBALS
       * @cfg {Boolean}
       */
      protected $isMain;

      /**
       * @param {Array} [$params]
       * @param {Array.Array} [$params["arguments"]]
       * @param {Array.Object} [$params["handlers"]]
       * @param {Array.Array} [$params["handlersErrors"]]
       * @param {Boolean} [$params["isMain"]]
       */
      function __construct ($params = []) {
         // Настройка обработчиков
         $this->setupHandlers("handlers", $params["handlers"]);
         $this->setupHandlers("handlersErrors", $params["handlersErrors"]);

         // Настроим аргументы
         if (is_array($params["arguments"])) {
            $this->arguments = $params["arguments"];
         } else {
            $this->arguments = [];
         }

         // Настроим глобальный запрос
         if ($isMain && !isset($GLOBALS["query"])) {
            $GLOBALS["query"] = $this;
         }
      }

      /**
       * Настроить обработчики
       * @param {String} $nameProp
       * @param {Array.Array} $handlers
       */
      protected function setupHandlers ($nameProp, $handlers = []) {
         // Настройка обработчиков
         $this->$nameProp = [
            "POST" => [],
            "GET" => [],
            "PUT" => [],
            "DELETE" => [],
            "ALL" => []
         ];

         // Дополнительная проверка
         if (!is_array($handlers)) {
            $handlers = [];
         }

         // Заполним массив обработчиков
         foreach ($handlers as $method => $handlersMethod) {
            foreach ($handlersMethod as $route => $handler) {
               $this->addHandlerByProp($nameProp, $method, $route, $handler);
            }
         }
      }

      /**
       * Добавить обработчик по назначению (property)
       * @param {String} $nameProp
       * @param {String} $method
       * @param {String} $route
       * @param {Array} $handler
       * @param {Array} $handler["path"]
       * @param {Array} $handler["arguments"]
       * @param {Function} $handler["callback"]
       */
      protected function addHandlerByProp ($nameProp, $method, $route, $handler) {
         $this->$nameProp[$method][$route] = $handler;
      }

      /**
       * Проверить роутер
       * @param {String} $route
       * @param {String} $queryRoute
       * @return {Boolean}
       */
      protected function checkRoute ($route, $queryRoute) {
         $resultMatch = [];
         $template = ("/" . $route . "/");
         preg_match($template, $queryRoute, $resultMatch);

         // Если роутер подходит, вернем результат поиска
         if (count($resultMatch) > 0) {
            return $resultMatch;
         } else {
            return null;
         }
      }

      /**
       * Запустить обработчик
       * @param {String} $queryRoute
       * @param {String} $route
       * @param {Array} $handler
       */
      protected function runHandler ($route, $queryRoute, $handler) {
         $checkRoute = $this->checkRoute($route, $queryRoute);

         // Если подходит роутер
         if (isset($checkRoute)) {
            // Если есть путь до скрипта
            $path = $handler["path"];
            if (isset($path) && file_exists($path)) {
               include($path);
            }

            // Если есть обработчик
            if (is_callable($handler["callback"])) {
               // Аргументы обработчика
               $arguments = $handler["arguments"];

               if (!is_array($arguments)) {
                  $arguments = [];
               }

               // Добавим общие (обязательные аргументы)
               $arguments = array_merge($this->arguments, $arguments);

               // Добавим в аргуементы инстанс текщего запроса
               $arguments[] = $this;

               // Добавим резутаты парсинга роутера, т.к. там пишится регулярка
               $arguments[] = $checkRoute;

               // Вызовов обработчика
               call_user_func_array($handler["callback"], $arguments);
            }

            return true;
         }
      }

      /**
       * Проход по обработчикам (роутингам) группы обработчиков
       * @param {String} $nameProp
       * @param {String} $nameGroup
       * @param {String} $queryRoute
       * @param {Boolean} [$isExit]
       */
      protected function eachHandlerByProp ($nameProp, $nameGroup, $queryRoute, $isExit = true) {
         // Обработчики группы (метода)
         $handlers = $this->$nameProp[$nameGroup];

         foreach ($handlers as $route => $handler) {
            // Если подошел роутер
            if ($this->runHandler($route, $queryRoute, $handler)) {
               if ($isExit) {
                  exit;
               }

               break;
            }
         }
      }

      /**
       * Запустить проверку обработчиков
       * @param {String} $nameProp
       * @param {String} $queryRoute Чтобы проверить именного определенный роут
       * @param {Boolean} [$isExit]
       */
      protected function runByProp ($nameProp, $queryRoute, $isExit = true) {
         $queryMethod = $this->method();

         // Прохот по методам
         foreach ($this->$nameProp as $method => $handlersMethod) {
            /**
             * Сначала проверим есть ли обработчик по методу
             * Иначе посмотрим, если обработчик для всех методов
             */
            if ($method === $queryMethod) {
               // Проход по роутингам
               $this->eachHandlerByProp($nameProp, $method, $queryRoute, $isExit);
            }
         }

         // Проход по роутингам для всех методов
         $this->eachHandlerByProp($nameProp, "ALL", $queryRoute, $isExit);

         /**
          * Если не нашли ни одного обработчика по роутингам
          * Попробуем найти общий для всех роутингов обработчик
          */
         if (isset($this->$nameProp["ALL"]["ALL"])) {
            if ($this->runHandler("ALL", "ALL", $this->$nameProp["ALL"]["ALL"])) {
               if ($isExit) {
                  exit;
               }
            }
         }
      }

      /**
       * Дорабавить обработчик
       * @param {String} $method
       * @param {String} $route
       * @param {Array} $handler
       */
      public function addHandler ($method, $route, $handler) {
         $this->addHandlerByProp("handlers", $method, $route, $handler);
      }

      /**
       * Дорабавить обработчик ошибки
       * @param {String} $method
       * @param {String} $route
       * @param {Array} $handler
       */
      public function addHandlerError ($method, $route, $handler) {
         $this->addHandlerByProp("handlersErrors", $method, $route, $handler);
      }

      /**
       * Запустить обработчик ошибки (если он есть)
       * @param {Number|String} $queryRoute Ключ ошибки
       * @param {Boolean} $status Отправлять ли статус
       */
      public function error ($queryRoute, $status = false) {
         $this->runByProp("handlersErrors", $queryRoute, false);

         // Если необходимо отправить статус
         if ($status) {
            $this->status($queryRoute);
         }

         exit;
      }

      /**
       * Запустить обработку запроса с помощью установленных обработчиков
       */
      public function run () {
         $queryRoute =  $this->data();
         $queryRoute = $queryRoute->route;
         $this->runByProp("handlers", $queryRoute);

         $this->error(503, true);
      }
   }
?>