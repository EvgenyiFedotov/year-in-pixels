<?php
   // Сразу загрузим необходимые данные
   $ninjphp->including(["data-base"]);
   $data = $query->data();

   $events = Object::call([
      "object" => "Event",
      "method" => "list"
   ], $app->config, "Obj/", [
      [
         "begin" => $data->begin,
         "end" => $data->end
      ]
   ]);

   $templateParams["events"] = $events;
?>