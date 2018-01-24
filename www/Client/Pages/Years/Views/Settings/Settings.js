define([
   'jade!Pages/Years/Views/Settings/Settings',
   'css!Pages/Years/Views/Settings/Settings'
], function(template) {
   'use strict';

   return Backbone.View.extend({
      /**
       * Контейнер темплейта
       * @config {jQuery}
       */
      $template: null,

      /**
       * @config {Object}
       */
      events: {
         'click .button[data-name="close"]': 'hide'
      },

      /**
       * @param {Object} options
       * @param {Boolean} options.show
       */
      initialize: function (options) {
         this.$template = $('<div />', {
            class: 'settings',
            attr: {
               'data-show': !!options.show
            }
         });

         this.$el.append(this.$template);

         this.render(options);
      },

      /**
       * Рендер
       * @param {Object} params
       */
      render: function(params) {
         this.$template.html( template(params || {}) );
         return this;
      },

      /**
       * Отобразить панель
       */
      show: function(e) {
         this.$template.attr('data-show', 'true');
         this.trigger('show', e);
      },

      /**
       * Скрыть панель
       */
      hide: function(e) {
         this.$template.attr('data-show', 'false');
         this.trigger('hide', e);
      }
   });
});