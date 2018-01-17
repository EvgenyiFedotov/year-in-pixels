define([
   'Pages/Years/Views/Year',
   'Pages/Years/Views/Palette',
   'Views/FloatArea/FloatArea',
   'Pages/Years/Helpers',
   'jade!Pages/Years/Templates/Palette',
   'Core/Service',

   'css!Pages/Years/Styles/Main',
   'css!Pages/Years/Styles/Palette'
], function (Year, Palette, FloatArea, Helpers, tPalette, service) {
   'use strict';

   var $body = $('body');

   var palette = tPalette({
      palette: window.palette,
      style: Helpers.styleColorBlock
   });

   var vPalette = new Palette({
      el: $(palette)
   });

   var paletteButton = new Palette({
      el: $(palette)
   });

   /**
    * Экземпляр пелетки с цветами
    */
   var floatArea = new FloatArea({
      $el: vPalette.$el,
      $border: $('.content .table')
   });

   var paletteButtonFA = new FloatArea({
      $el: paletteButton.$el,
      $border: $body
   });

   var year = new Year({
      el: $body
   });

   year.listenTo(vPalette, 'click', function(date, data) {
      // Отправим данные на сервер
      service.post('Days.Write', {
         date: date,
         status: data.status
      }, {
         success: function(result) {
            this.colorDay(date, data.color);
         }.bind(this)
      });
   });

   // ОБработчик клика по цветному блоку
   year.on('clickBlockColor', function(e) {
      var $target = $(e.target);

      e.stopPropagation();

      floatArea.show($target);

      vPalette.date = $target.data().date;

      paletteButtonFA.hide();

      this.setBlur(true);
   });

   // Обработчик клика по всей области
   year.on('click', function(e) {
      floatArea.hide();
      paletteButtonFA.hide();
      this.setBlur(false);
   });

   // Клик по кнопке с палеткой
   year.$('.button[name="palette"]').click(function(e) {
      var $target = $(e.target);

      e.stopPropagation();

      paletteButtonFA.show($target);
   });

   if (window.palette) {
      delete window.palette;
   }
});