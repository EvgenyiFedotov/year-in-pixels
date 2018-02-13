define([
   'Pages/Years/Data/Day.Collection'
], function(Days) {
   'use strict';

   var days = new Days(window.days || [
      {
         date: '2018-02-13',
         status_id: 7,
         note: 'asd asd jabs dfkjahgsodf uybqw gieurn kjd hfja bsdo fuasb,dfm!!!!!!!!!'
      }, {
         date: '2018-02-04',
         status_id: 7
      }, {
         date: '2018-02-05',
         status_id: 6
      }, {
         date: '2018-02-06'
      }, {
         date: '2019-02-05'
      }
   ], {
      parse: true
   });

   if (window.days) {
      delete window.days;
   }

   return days;
});