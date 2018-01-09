<?php
   /**
    * Класс конфигурирования и получения конфига из файла
    *
    * @cfg {String|stdObject} $cfg
    * @cfg {stdObject} $params
    *
    * ! Найтройка пути до дирректории производится через дополнительные параметры
    * @cfg {String} $params->dir
    *
    * Позволяет:
    * - Прочитать конфиг из файла
    * - Получить путь до файла относительно настройки пути до дирректории
    * При получении пути есть поиск начия дублируемых путей в переданном пути
    */
   class Config {
      /**
       * @param {String|stdClass|Array} $cfg
       * @param {stdClass} $params
       */
      function __construct ($config = [], $params = []) {
         // Если передали путь до конфига, прочитаем его
         if (is_string($config)) {
            $config = $this->readConfig($config);
         }

         $config = (array) $config;

         // Если передали конфигурацию массивом
         if (is_array($config)) {
            // Подключим родительские конфигурации
            $config = $this->includingConfigs($config);

            // Пройдем по конфигу и установим его в проперти
            foreach ($config as $nameProp => $value) {
               $this->$nameProp = $value;
            }
         }

         // Настроим конфиг
         $this->setupConfig($params);
      }

      /**
       * Подключить родительские конфигурации исходя из текущей конфигурации
       * @param {Object} $config
       */
      protected function includingConfigs ($config = []) {
         $configs = $config["configs"];

         // Пройдем по подлючаемым конфигам и доработаем текущий
         if (isset($configs)) {
            foreach ($configs as $index => $includeConfig) {
               if (is_string($includeConfig)) {
                  $includeConfig = $this->readConfig($includeConfig);
               }

               if (is_object($includeConfig)) {
                  $config = array_merge((array) $includeConfig, $config);
               }
            }
         }

         return $config;
      }

      /**
       * Прочитать конфиг из файла
       * @param {String} $path
       */
      protected function readConfig ($path) {
         $path = $this->findDoublePaths($path);
         $result = null;

         if (file_exists($path)) {
            $result = json_decode(file_get_contents($path));
         }

         return $result;
      }

      /**
       * Произвести происк дублируемых путей и заменить их
       * ./[Config].php => ./Config/Config.php
       * ./src/[Config]/Test.php => ./src/Config/Config/Test.php
       * @param {String} $path
       * @return {String}
       */
      protected function findDoublePaths ($path) {
         $pathArr = explode("/", $path);

         foreach ($pathArr as $index => $subPath) {
            $res = [];
            preg_match("/\[(.*)\]/", $subPath, $res);

            // Если нашли дублируемые пути, то заменим
            if (count($res)) {
               $pathArr[$index] = $res[1] . "/" . $res[1];

               // Если есть раширение, то добавим его
               if ($res[1] !== "." && $res[1] !== "..") {
                  $pathInfo = pathinfo($subPath);
                  if (isset($pathInfo["extension"])) {
                     $pathArr[$index] .= "." . $pathInfo["extension"];
                  }
               }
            }
         }

         if (count($pathArr) > 1) {
            return join("/", $pathArr);
         } else {
            return $pathArr[0];
         }
      }

      /**
       * Заменить слэши на обратные
       * @param {String} $value
       */
      protected function replaceSlash ($value) {
         return preg_replace("/\\\\/", "/", $value);
      }

      /**
       * Настроить конфиг
       * @param {stdClass} $params
       */
      protected function setupConfig ($params = []) {
         // code...
      }
   }
?>