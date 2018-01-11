<?php
   include_once("Config.php");

   /**
    * Класс подключения, мапирования приложения
    *
    * Описание секций конфига:
    *
    * Родительский набор конфигураций
    * При найтройке сначала подгрузим их и смержим
    * Последовательность важна! Свойства будут перезатираться
    * @cfg {Array} configs
    *
    * Сокращенные пути (Карта путей)
    * @cfg {Object} paths
    *
    * Описание модулей
    * @cfg {Object.Object} modules
    * Описание модуля
    * @cfg {Object} module
    * Подключаемые файлы для модуля
    * @cfg {Array.String} module.include
    *
    * Подкючаем файлы / модули
    * @cfg {Array.String} include
    */
   class RequireConfig extends Config {
      /**
       * Настроить конфиг
       * @param {stdClass} $params
       */
      protected function setupConfig($params = []) {
         $this->modules = (array) $this->modules;

         // Подключим необходимые файлы
         $this->includeFiles();
      }

      /**
       * Получить пути до файлов директории
       * @param {String} $path
       * @param {Boolean} $recursion
       */
      public function pathFilesDir($path, $recursion = false) {
         $path = $path . "/";

         $result = [
            "dirs" => [],
            "files" => []
         ];

         if (is_dir($path)) {
            if ($dh = opendir($path)) {

               while (($file = readdir($dh)) !== false) {
                  $type = filetype($path . $file);

                  if ($type === "dir" && $file !== "." && $file !== "..") {
                     $result["dirs"][] = $path . $file;
                  } elseif ($type === "file") {
                     $result["files"][] = $path . $file;
                  }
               }

               closedir($dh);
            }
         }

         // Если нужно собрать рекурсионно
         if ($recursion) {
            foreach ($result["dirs"] as $index => $path) {
               $recResult = $this->pathFilesDir($path, true);

               $result["dirs"] = array_merge($result["dirs"], $recResult["dirs"]);
               $result["files"] = array_merge($result["files"], $recResult["files"]);
            }
         }

         return $result;
      }

      /**
       * Получить путь до файла исходя из конфига
       * @param {String} $path
       */
      public function pathFile($path) {
         $paths = $this->paths;

         // Если существуют обозначения путей (карта путей)
         if (isset($paths)) {
            $paths = (array) $paths;
            $pathArr = explode("/", $path);

            // Определим начало пути, т.к. оно может быть указано из карты путей
            if (in_array($pathArr[0], array_keys($paths))) {
               $pathArr[0] = $paths[ $pathArr[0] ];
            }

            $path = join("/", $pathArr);
         }

         return $this->findDoublePaths($path);
      }

      /**
       * Подключить файл / модуль
       * @param {String} $path
       */
      public function includeFile($path) {
         $path = $this->pathFile($path);

         // Проверим, не модуль ли это
         // Если модуль подключим необходимые для него файлы
         if (in_array($path, array_keys($this->modules))) {
            $this->includeFiles($this->modules[$path]->include);

         // Проверим существование файла
         } elseif (file_exists($path)) {
            include_once($path);

         // Если файл не существует и подключаем все файлы папки (в пути есть "*")
         } elseif (end(explode("/", $path)) === "*") {
            // Преобразуем путь
            $pathArr = explode("/", $path);
            array_pop($pathArr);
            $path = join("/", $pathArr);

            $pathArr = explode("::", $path);
            $path = end($pathArr);

            // Если были переданы настройки для пути
            if (count($pathArr) > 1) {
               // Получим еще раз полный путь
               $path = $this->pathFile($path);

               // Проверим флаг рекурсии
               $recursion = $pathArr[0] === "r";
            }

            $this->includeFiles($this->pathFilesDir($path, $recursion)["files"]);
         }
      }

      /**
       * Подключить назначенные для этого файлы
       * @param {Array} $include
       */
      public function includeFiles($include = []) {
         if (!count($include)) {
            $include = $this->include;
         }

         if (isset($include) && is_array($include) && count($include) > 0) {
            foreach ($include as $index => $path) {
               $this->includeFile($path);
            }
         }
      }
   }
?>