<?php
   Query\route([
      "route" => "/test(.*)/",
      "handler" => function() {
         echo "Test";
      },
      "priority" => 100
   ]);
?>