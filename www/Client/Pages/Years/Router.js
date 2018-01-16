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

      service.post('Days.Write', {
         date: date,
         status: data.status
      }, {
         success: function(result) {
            console.log(result);
         }
      });

      service.get('Days.List', null, {
         success: function(result) {
            console.log(result);
         }
      });

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