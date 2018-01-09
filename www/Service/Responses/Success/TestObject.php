<?php
   response("GET", "test={0,1}(.*)", function ($app, $ninjphp, $query, $route) {
      $ninjphp->including(["data-base"]);

      $result = Object::call($query->data(), $app->config, "Obj/");

      print_r($result);
   });
?>