<?php
   Query\route([
      "route" => "/te(st)/",
      "handler" => function() {
         echo "Test-2";
      },
      "priority" => 0
   ]);
?>