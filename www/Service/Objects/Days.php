<?php
   class Days {
      public function List($query) {
         if ($query->method("DELETE")) {
            echo "Method:Days.List\n";
            print_r($query->data());
            echo $query->dataString();
         }
      }
   }
?>