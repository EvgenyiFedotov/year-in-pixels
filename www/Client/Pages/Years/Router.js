define([
   'Pages/Years/Views/Year',
   'Pages/Years/Views/Palette',
   'Views/FloatArea/FloatArea',
   'Pages/Years/Helpers',
   'jade!Pages/Years/Templates/Palette',

   'css!Pages/Years/Styles/Main',
   'css!Pages/Years/Styles/Palette'
], function (Year, Palette, FloatArea, Helpers, tPalette) {
   'use strict';

   var vPalette = new Palette({
      el: $(tPalette({
         palette: window.palette,
         style: Helpers.styleColorBlock
      }))
   });

   /**
    * Экземпляр пелетки с цветами
    */
   var floatArea = new FloatArea({
      $el: vPalette.$el,
      $border: $('.content .table')
   });

   var year = new Year({
      el: $('body')
   });

   year.listenTo(vPalette, 'click', function(date, data) {
      this.colorDay(date, data.color);

      console.log(arguments);
   });

   // ОБработчик клика по цветному блоку
   year.on('clickBlockColor', function(e) {
      e.stopPropagation();

      var $target = $(e.target);

      floatArea.show($target);
      vPalette.date = $target.data().date;

      this.setBlur(true);
   });

   // Обработчик клика по всей области
   year.on('click', function(e) {
      floatArea.hide();
      this.setBlur(false);
   });

   if (window.palette) {
      delete window.palette;
   }
});