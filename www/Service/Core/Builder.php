<?php
   include_once("Service/Librarys/NinjPhp/RequireConfig.php");

   /**
    * Класс сборки проекта
    * @param {String} $pathFrom
    * @param {String} $pathIn
    * @param {Array.<String>} [$exceptions] (Передаются как регулярные выражения)
    * @param {Array.<String>} [$includes] (Передаются как регулярные выражения)
    * @param {Function} $contentHandler
    */
   class Builder extends RequireConfig {
      /**
       * Проверить является ли путь исключением
       * @param {String} $path
       * @param {Array.<String>} [$exceptions]
       */
      public function isExceptionPath($path, $exceptions = []) {
         $checkPath = explode("/", $path);
         array_shift($checkPath);
         $checkPath = join("/", $checkPath);
         $isException = false;
         $matchResult = [];

         foreach ($exceptions as $indexExc => $exception) {
            preg_match_all("/^". $exception . "/", $checkPath, $matchResult);

            if (count($matchResult[0])) {
               $isException = true;
            }
         }

         return $isException;
      }

      /**
       * Преобразовать путь, по корню
       * @param {String} $root
       * @param {String} $path
       */
      public function convertPathByRoot($root, $path) {
         $pathArr = explode("/", $path);
         $pathArr[0] = $root;
         return join("/", $pathArr);
      }

      /**
       * Копировать файл
       * @param {String} $pathFrom
       * @param {String} $pathIn
       * @param {Function} $callback
       */
      public function copyFile($pathFrom, $pathIn, $callback = null) {
         $content = file_get_contents($pathFrom);

         // Если передали обработчик
         if (is_callable($callback)) {
            $contentCallback = call_user_func_array($callback, [
               pathinfo($pathFrom),
               $content
            ]);

            // Если вернули контент
            if (isset($contentCallback)) {
               $content = $contentCallback;
            }
         }

         file_put_contents($pathIn, $content);
      }

      /**
       * Копировать дирректорию
       * @param {String} $pathFrom
       * @param {String} $pathIn
       * @param {Array.<String>} [$exceptions] (Передаются как регулярные выражения)
       * @param {Array.<String>} [$includes] (Передаются как регулярные выражения)
       * @param {Function} $contextHandler Обработчик контента при копировании файла
       */
      public function cloneFolder($pathFrom, $pathIn, $exceptions = [], $includes = [], $contextHandler = null) {
         // Пути до файлов и дирректорий
         $paths = $this->pathFilesDir($pathFrom, true);

         // Создадим корневую папку минимизированных файлов
         if (!file_exists($pathIn)) {
            mkdir($pathIn);
         }

         echo "<b>Clone:</b></br>";
         echo "<b><i>Folders:</i></b></br>";

         // Склонируем папки в минимальную версию
         foreach ($paths["dirs"] as $key => $path) {
            // Узнаем иссключение или нет
            $isException = $this->isExceptionPath($path, $exceptions);

            // Если не является исключением, копируем
            if ($isException === false) {
               $pathMin = $this->convertPathByRoot($pathIn, $path);
               echo $pathMin . "</br>";

               if (!file_exists($pathMin)) {
                  mkdir($pathMin);
               }
            }
         }

         echo "</br><b><i>Folders includes:</i></b></br>";

         // Скопируем папки (Включения)
         foreach ($includes as $index => $path) {
            $pathArr = explode("/", $path);
            $pathCheckDir = $pathFrom;
            $pathMin = $pathIn;

            foreach ($pathArr as $indexPathEl => $pathEl) {
               $pathMin .= "/" . $pathEl;
               $pathCheckDir .= "/" . $pathEl;

               if (is_dir($pathCheckDir)) {
                  echo $pathMin . "</br>";

                  if (!file_exists($pathMin)) {
                     mkdir($pathMin);
                  }
               }
            }
         }

         echo "</br>";
         echo "<b><i>Files:</i></b></br>";

         // Скопируем файлы в минимальную версию
         foreach ($paths["files"] as $index => $path) {
            // Узнаем иссключение или нет
            $isException = $this->isExceptionPath($path, $exceptions);

            // Если не является исключением, копируем
            if ($isException === false) {
               $pathMin = $this->convertPathByRoot($pathIn, $path);

               $this->copyFile($path, $pathMin, $contextHandler);

               echo $pathMin . "</br>";
            }
         }

         echo "</br><b><i>Files includes:</i></b></br>";

         // Скопируем файлы в минимальную версию (Включения)
         foreach ($includes as $index => $path) {
            /**
             * Если передали путь до дирректории, значит копируем все файлы внутри,
               * но не рекурсивно
               */
            if (is_dir($pathFrom . "/" . $path)) {
               $files = $this->pathFilesDir($pathFrom . "/" . $path);
               $files = $files["files"];

               foreach ($files as $indFile => $pathFile) {
                  $pathMin = $this->convertPathByRoot($pathIn, $pathFile);

                  $this->copyFile($pathFile, $pathMin, $contextHandler);

                  echo $pathMin . "</br>";
               }
            } else {
               $path = $pathFrom . "/" . $path;
               $pathMin = $this->convertPathByRoot($pathIn, $path);

               $this->copyFile($path, $pathMin, $contextHandler);

               echo $pathMin . "</br>";
            }
         }
      }

      /**
       * Удалить дирректорию
       * @param {String} $path
       */
      public function removeFolder($path) {
         $paths = $this->pathFilesDir($path);

         // Удалим папки
         foreach ($paths["dirs"] as $index => $pathDir) {
            $this->removeFolder($pathDir);
         }

         // Удалим файлы
         foreach ($paths["files"] as $index => $pathFile) {
            unlink($pathFile);
         }

         // Удалим директорию
         if (is_dir($path)) {
            rmdir($path);
         }
      }

      /**
       * Зпустить сборку
       */
      public function build() {
         // Очистим папку в которую будем собирать
         $this->removeFolder($this->pathIn);

         // Запустим клонирование файлов
         $this->cloneFolder(
            $this->pathFrom,
            $this->pathIn,
            $this->exceptions,
            $this->includes,
            $this->handlerContent
         );
      }
   }
?>