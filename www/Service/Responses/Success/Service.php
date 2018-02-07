<?php
   Query\route([
      "route" => "service\/service",
      "type" => "success",
      "priority" => 600,
      "handler" => function($require, $route, $configRoute, $query) {
         $pathObject = $query->pathToObject();
         $require->includeFiles([
            "data-base",
            "Object/" . $pathObject["object"] . ".php"
         ]);

         // Проверим, подключи ли вызываемый класс
         if (class_exists($pathObject["object"])) {
            // Создадим экземпляр объекта и вызовем метод
            $classObject = new ReflectionClass($pathObject["object"]);

            // Проверим наличие вызываемого метода
            if ($classObject->hasMethod($pathObject["method"])) {
               $instObject = $classObject->newInstanceArgs([]);
               $methodObject = new ReflectionMethod($pathObject["object"], $pathObject["method"]);

               // Проверим публичность вызываемого метода, если вызвали не пудличный, отдим ошибку
               if ($methodObject->isPublic()) {
                  $methodObject->invokeArgs($instObject, [$query, $require, $pathObject]);
               } else {
                  $query->error(503, true);
               }
            } else {
               $query->error(503, true);
            }
         } else {
            $query->error(503, true);
         }

         exit;
      }
   ]);
?>