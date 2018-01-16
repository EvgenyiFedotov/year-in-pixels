<?php
   Query\route([
      "route" => "test(.*)",
      "type" => "success",
      "handler" => function() {
         echo "Test:100</br>";
      }
   ]);
?>