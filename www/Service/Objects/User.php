<?php
   include_once("Service/Core/Object.php");

   class User extends Object {
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
         $connect = $this->connect();
         if ($connect->has("users", ["login" => $login])) {
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
            $connect = $this->connect();
            $result = $connect->insert("users", [
               "login" => $data["login"],
               "password" => md5($data["password-1"])
            ]);

            // Если успешная запись
            if ($result->rowCount()) {
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
         $password = $data["password-1"];

         // Проверим корректность введенных данных
         $this->validateLogin($query, $login);
         $this->validatePass($query, $password);

         // Если все хорошо, произведем вход, если конечно данные корректные
         $connect = $this->connect();
         $user = $connect->get("users", [
            "id", "login", "theme"
         ], [
            "login" => $login,
            "password" => md5($password)
         ]);

         if ($user) {
            $_SESSION["user"] = $user;
            $query->response("OK");
         } else {
            $query->error(404, "The entered data is incorrect!");
         }
      }

      /**
       * Поменять тему
       */
      public function changeTheme($query) {
         if (isset($_SESSION["user"])) {
            $data = $query->data();
            $connect = $this->connect();

            $result = $connect->update("users", [
               "theme" => $data["name"]
            ], [
               "id" => $_SESSION["user"]["id"]
            ]);

            if ($result->rowCount()) {
               $query->response("OK");
            } else {
               $this->error();
            }
         } else {
            $this->error();
         }
      }

      /**
       * Изменить пароль
       */
      public function passwordEdit($query) {
         if (isset($_SESSION["user"])) {
            $data = $query->data();
            $passOld = $data['password-old'];
            $pass1 = $data['password-1'];
            $pass2 = $data['password-2'];

            // Проверим введеные данные
            if ($this->validatePass($query, $passOld)
            && $this->validatePass($query, $pass1)
            && $this->validatePass($query, $pass2)
            && $pass1 === $pass2) {
               $connect = $this->connect();
               $userId = $_SESSION["user"]["id"];
               $isCorrect = $connect->has("users", [
                  "id" => $userId,
                  "password" => md5($passOld)
               ]);

               if ($isCorrect) {
                  $result = $connect->update("users", [
                     "password" => md5($pass1)
                  ], [
                     "id" => $userId
                  ]);

                  if ($result->rowCount()) {
                     $query->response("Password changed successfully!");
                  } else {
                     $query->error(500, true);
                  }
               } else {
                  $query->error(404, "The entered data is incorrect!");
               }
            } else {
               $query->error(404, "The entered data is incorrect!");
            }
         } else {
            $this->error();
         }
      }

      /**
       * Сохранить чат ид для телеграмма
       * @param {String|Number} $shat_id
       */
      public function saveChatId($chat_id) {
         // Сохраним чат ид, только тогда, когда пользователь зашел
         if (isset($_SESSION["user"])
         && (is_numeric($chat_id) || is_string($chat_id))) {
            $connect = $this->connect();

            $result = $connect->update("users", [
               "chat_id" => $chat_id
            ], [
               "id" => $_SESSION["user"]["id"]
            ]);

            if ($result->rowCount()) {
               return true;
            } else {
               return false;
            }
         } else {
            return false;
         }
      }

      /**
       * Выход
       */
      public function singout($query) {
         if (isset($_SESSION["user"])) {
            unset($_SESSION["user"]);
            $query->response("OK");
         } else {
            $this->error();
         }
      }
   }
?>