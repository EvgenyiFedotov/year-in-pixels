<?php
   include_once("Protected/User.php");

   class Auth {
      /**
       * Валидация логина
       */
      protected function validateLogin($query, $login) {
         if (!strlen($login)) {
            $query->error(404, "Invalid login value!");
         }

         return true;
      }

      /**
       * Валидация пароля
       */
      protected function validatePass($query, $passord) {
         if (strlen($passord) < 4) {
            $query->error(404, "Invalid password value!");
         }

         return true;
      }

      /**
       * Валидация данных при регистрации
       */
      protected function validateSingup($query, $data) {
         $login = $data["login"];
         $pass1 = $data["password-1"];
         $pass2 = $data["password-2"];

         // Проверим корректность логина
         $this->validateLogin($query, $login);

         // Проверим корректность пароля
         $this->validatePass($query, $pass1);
         $this->validatePass($query, $pass2);
         if ($pass1 !== $pass2) {
            $query->error(404, "Invalid password value!");
         }

         // Проверим существование пользователя с введенным логином
         $object = new Object();
         if ($object->hasRow("users", ["login" => $login])) {
            $query->error(404, "User with such login exists!");
         }

         return true;
      }

      /**
       * Регистрация
       */
      public function singup($query) {
         $data = $query->data();

         // Проверим корректность введенных данных
         if ($this->validateSingup($query, $data)) {
            $object = new Object();
            $id = $object->writeRow("users", [
               "login" => $data["login"],
               "password" => md5($data["password-1"])
            ]);

            if ($id) {
               $query->response("User successfully registered!");
            } else {
               $query->error(500, true);
            }
         }
      }

      /**
       * Аутентификация
       */
      public function singin($query) {
         $data = $query->data();
         $login = $data["login"];
         $pass = $data["password-1"];

         // Проверим корректность введенных данных
         $this->validateLogin($query, $login);
         $this->validatePass($query, $pass);

         $object = new Object();
         $id = $object->hasRow("users", [
            "login" => $login,
            "password" => md5($pass)
         ]);

         if ($id) {
            $_SESSION["user"] = ["id" => $id, "login" => $login];
            $query->response("OK");
         } else {
            $query->error(404, "The entered data is incorrect!");
         }
      }

      /**
       * Изменить пароль
       */
      public function passwordEdit($query) {
         $data = $query->data();
         $passOld = $data['password-old'];
         $pass1 = $data['password-1'];
         $pass2 = $data['password-2'];

         // Проверим введеные данные
         if ($query->method("POST") && isset($_SESSION["user"])
         && $this->validatePass($query, $passOld)
         && $this->validatePass($query, $pass1)
         && $this->validatePass($query, $pass2)
         && $pass1 === $pass2) {
            $login = $_SESSION["user"]["login"];

            $object = new Object();

            $id = $object->hasRow("users", [
               "login" => $login,
               "password" => md5($passOld)
            ]);

            if ($id) {
               $id = $object->writeRow("users", [
                  "password" => md5($pass1)
               ], [
                  "password" => md5($passOld),
                  "login" => $login
               ]);

               if ($id) {
                  $query->response("Password changed successfully!");
               } else {
                  $query->error(500, true);
               }
            } else {
               $query->error(500, true);
            }
         } else {
            $query->error(404, "The entered data is incorrect!");
         }
      }

      /**
       * Выход
       */
      public function singout($query) {
         unset($_SESSION["user"]);
         $query->response("OK");
      }
   }
?>