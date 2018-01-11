<?php
   use Tale\Pug;

   Query\response("ALL", "(.*)", function($app, $query, $route) {
      // Преобразуем Less в CSS
      $lesscss = new LessCSS([
         "inportDirs" => ["Client/"],
         "convertDirs" => [
            "Client/Pages",
            "Client/Styles"
         ]
      ]);
      $lesscss->convert();

      // Имя страницы
      $namePage = ucfirst($route[0]);

      // Путь до темплейта
      $template = $app->pathFile("Client/Pages/" . $namePage . "/Templates/Main.jade");

      // Путь до основного темлейта (вдруг не найдет темлейт для страницы)
      $templateMain = $app->pathFile("Client/Page/Template.jade");

      // Параметры для темлейта
      $templateParams = ["namePage" => $namePage];

      // Рендер
      $renderer = new Pug\Renderer(["cache_path" => "./"]);

      // Путь до файла с преобработкой (загрузкой данных) для страницы
      $pathPageProc = $app->pathFile("Service/Pages/" . $namePage . ".php");

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
   });
?>