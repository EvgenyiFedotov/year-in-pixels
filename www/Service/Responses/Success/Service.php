<?php
   Query\route([
      "route" => "service\/service",
      "type" => "service",
      "priority" => 500,
      "handler" => function($require, $route, $configRoute, $query) {
         $pathObject = $query->pathToObject();
         $require->includeFiles([
            "data-base",
            "Object/" . $pathObject["object"] . ".php"
         ]);

         // Создадим экземпляр объекта и вызовем метод
         $classObject = new ReflectionClass($pathObject["object"]);
         $instObject = $classObject->newInstanceArgs([]);
         $methodObject = new ReflectionMethod($pathObject["object"], $pathObject["method"]);

         // Проверим публичность вызываемого метода, если вызвали не пудличный, отдим ошибку
         if ($methodObject->isPublic()) {
            $methodObject->invokeArgs($instObject, [$query, $require, $pathObject]);
         } else {
            $query->error(503, true);
         }

         exit;
      }
   ]);
?>