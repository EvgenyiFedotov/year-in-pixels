<?php
   use Tale\Pug;

   Query\route([
      "route" => ".*",
      "type" => "success",
      "priority" => 500,
      "handler" => function($require, $route, $configRoute, $query) {
         $require->includeFiles(["data-base", "less-css", "jade"]);

         // Преобразуем Less в CSS
         // $lesscss = new LessCSS([
         //    "inportDirs" => ["Client/"],
         //    "convertDirs" => [
         //       "Client/Page/Themes/Compiled",
         //       "Client/Views",
         //       "Client/Pages"
         //    ]
         // ]);
         // $lesscss->convert();

         // Имя страницы
         $namePage = ucfirst($route[0]);

         // Если пользователь еще не залогинился, выдадим страницу "Auth", иначе "Years"
         if (isset($_SESSION["user"])) {
            $namePage = "Years";
         } else {
            $namePage = "Auth";
         }

         // Путь до темплейта
         $template = $require->pathFile("Client/Pages/" . $namePage . "/Template.jade");

         // Путь до основного темлейта (вдруг не найдет темлейт для страницы)
         $templateMain = $require->pathFile("Client/Page/Template.jade");

         // Параметры для темлейта
         $templateParams = ["namePage" => $namePage];

         // Рендер
         $renderer = new Pug\Renderer(["cache_path" => "./"]);

         // Путь до файла с преобработкой (загрузкой данных) для страницы
         $pathPageProc = $require->pathFile("Service/Pages/" . $namePage . ".php");

         // Если сущействует файл с преобработкой
         if (file_exists($pathPageProc)) {
            include($pathPageProc);
         }

         // Если есть темплейт страницы, отобразим его
         if (file_exists($template)) {
            echo $renderer->render($template, $templateParams);

         // Иначе подгрузим дефолтный темлейт
         } elseif (file_exists($templateMain)) {
            echo $renderer->render($templateMain, $templateParams);

         // Если не найдем и основной темлейт
         } else {
            $query->error(404, true);
         }

         exit;
      }
   ]);
?>