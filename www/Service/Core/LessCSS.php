<?php
   include_once("Service/Librarys/NinjPhp/RequireConfig.php");

   /**
    * Класс преобразования Less файлов в CSS
    *
    * Каталоги для импорта в конвертер
    * @cfg {Array} inportDirs
    */
   class LessCSS extends RequireConfig {
      /**
       * Запустить ковертирование
       */
      public function convert () {
         // Пройдем по всем директориям, файлы в которых требуют конвертации
         foreach ($this->convertDirs as $index => $path) {
            $paths = $this->pathFilesDir($path, true);
            
            // Пройдем по файлам
            foreach ($paths["files"] as $index => $pathFile) {
               $pathInfo = pathinfo($pathFile);
   
               if ($pathInfo["extension"] === "less") {
                  $this->convertFile($pathFile);
               }
            }
         }
      }

      /**
       * Конвертировать файл
       * @param {String} $path
       */
      public function convertFile ($path) {
         $less = new lessc();
         $less->setImportDir($this->inportDirs);

         $pathInfo = pathinfo($path);
         $pathOut = $pathInfo["dirname"] . "/" . $pathInfo["filename"] . ".css";

         $compileResult = $less->compileFile($path, $pathOut);
      }
   }
?>