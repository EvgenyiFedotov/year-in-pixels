define(function () {
   'use strict';

   var $html = $('html');
   var $body = $('body');

   // Отмена контекстного меню
   $html.on('contextmenu', false);

   // Уставновка видимость контента
   $body.css('visibility', 'visible');

   return {
      $html: $html,
      $body: $body
   };
});