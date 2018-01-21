<?php
   class Auth {
      /**
       * Регистрация
       */
      public function singup($query) {
         $query->response([
            "auth.singup"
         ], "User successfully registered!");
      }

      /**
       * Аутентификация
       */
      public function singin($query) {
         $query->error(404, "User with such login exists!");
         // $query->response([
         //    "auth.singin"
         // ]);
      }
   }
?>