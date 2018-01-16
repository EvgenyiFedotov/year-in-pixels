<?php
   Query\route([
      "route" => "test(.*)",
      "type" => "success",
      "priority" => 20,
      "handler" => function() {
         echo "Test-3:999</br>";

         // exit;
      }
   ]);
?>