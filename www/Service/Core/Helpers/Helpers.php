<?php
   /**
    * Распечатать массив / объект
    * @param {Object|Array} $data
    */
   function print_arr ($data) {
      foreach ($data as $key => $value) {
         echo "<b>" . $key . "</b><br/>";

         if (is_string($value)) {
            echo $value;
         } else {
            print_r($value);
         }

         echo "<br/>";
      }
   }
?>