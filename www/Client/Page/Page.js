define(function () {
   'use strict';

   var $html = $('html');
   var $body = $('body');

   // Отмена контекстного меню
   $html.on('contextmenu', false);

   // Уставновка видимость контента (Пока сделаем так, но нужно переделать)
   setTimeout(function() {
      $body.css('visibility', 'visible');
   }, 100);

   return {
      $html: $html,
      $body: $body
   };
});