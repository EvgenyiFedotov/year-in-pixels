<?php
   Query\route([
      "route" => "/test-4/",
      "priority" => 50,
      "type" => "error",
      "handler" => function() {
         echo "Test-4";
      }
   ]);
?>