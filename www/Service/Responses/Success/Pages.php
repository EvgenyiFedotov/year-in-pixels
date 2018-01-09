<?php
   /**
    * Сформируем ответ, если запросили страницу
    */
   use Tale\Pug;

   response("GET", "page={0,1}(.*)", function ($app, $ninjphp, $query, $route) {
      $config = $app->config;
      $configRenderer = (array) $config->renderer;
      $configRenderer["args"] = (array) $configRenderer["args"];

      // Преобразуем Less в СSS
      $less = new LessCss([
         "path" => "Client",
         "exception" => (object) [
            "paths" => ["Librarys"]
         ],
         "inportDirs" => ["Client/"]
      ]);
      $less->run();

      // Имя страницы
      $namePage = ucfirst($route[1]);

      // Путь до темплейта
      $template = $app->pathFile("Pages/" . $namePage . "/Templates/Main.jade");

      // Путь до основного темлейта (вдруг не найдет темлейт для страницы)
      $templateMain = $app->pathFile("Pages/Templates/Main.jade");

      // Параметры для темлейта
      $templateParams = [
         "namePage" => $namePage
      ];

      // Рендер
      $renderer = new Pug\Renderer(["cache_path" => "./"]);

      // Путь до файла с преобработкой (загрузкой данных) для страницы
      $pathPageProc = $app->pathFile("Pageproc/" . $namePage . ".php");

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