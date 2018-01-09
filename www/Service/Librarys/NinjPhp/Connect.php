<?php
   include_once("Config.php");

   /**
    * Класс для работы с БД
    *
    * @config {String} className
    * @config {Object|Array} config
    */
   class Connect extends Config {
      /**
       * Коннест с БД
       * @cfg {Medoo}
       */
      protected $connect;

      /**
       * Настроить конфиг
       * @param {Array} [$params]
       */
      protected function setupConfig($params = []) {
         $this->config = (array) $this->config;

         if (isset($this->className)) {
            $this->connect = new $this->className($this->config);
         }
      }

      /**
       * Вызвать метод коннекта
       * @param {String} $methodName
       * @param {Array} [$args]
       */
      public function __call($methodName, $args = []) {
         if (isset($this->connect)) {
            $method = new ReflectionMethod($this->className, $methodName);
            return $method->invokeArgs($this->connect, $args);
         }
      }
   };
?>