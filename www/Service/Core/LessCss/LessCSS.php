<?php
   /**
    * Класс преобразования Less файлов в CSS
    *
    * Каталоги для импорта в конвертер
    * @cfg {Array} inportDirs
    */
   class LessCSS extends Catalog {
      /**
       * Конвертировать файл
       * @param {String} $path
       */
      public function convertFile ($path) {
         $less = new lessc();
         $less->setImportDir($this->config->inportDirs);

         $pathInfo = pathinfo($path);
         $pathOut = $pathInfo["dirname"] . "/" . $pathInfo["filename"] . ".css";

         $compileResult = $less->compileFile($path, $pathOut);
      }

      /**
       * Запустить ковертирование
       */
      public function run () {
         $this->each(null, function ($path) {
            $pathInfo = pathinfo($path);

            if ($pathInfo["extension"] === "less") {
               $path = $this->config->path . $path;
               $this->convertFile($path);
            }
         });
      }
   }
?>