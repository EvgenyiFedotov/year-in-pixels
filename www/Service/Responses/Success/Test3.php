<?php
   Query\route([
      "route" => "/test(.*)/",
      "method" => "POST",
      "handler" => function() {
         echo "Test-3";
      }
   ]);
?>