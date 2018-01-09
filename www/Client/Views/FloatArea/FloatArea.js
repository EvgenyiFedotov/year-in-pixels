define(['css!Views/FloatArea/FloatArea'], function() {
   'use sctrict';

   /**
    * Получить границы элемента
    * @param {jQuery} $el
    */
   var borderElement = function($el) {
      var offset = $el.offset();

      offset.right = offset.left + $el.width();
      offset.bottom = offset.top + $el.height();

      return offset;
   };

   /**
    * Получить флаги по сторонам, где контейнер выходдит за контейнер
    * @param {Object} offset1
    * @param {Object} offset2
    */
   var checkBorders = function(offset1, offset2) {
      var result = {
         top: false,
         rigth: false,
         bottom: false,
         left: false
      };

      if (offset1.top < offset2.top) {
         result.top = true;
      }

      if (offset1.right > offset2.right) {
         result.rigth = true;
      }

      if (offset1.bottom > offset2.bottom) {
         result.bottom = true;
      }

      if (offset1.left < offset2.left) {
         result.left = true;
      }

      return result;
   };

   return Backbone.View.extend({
      /**
       * @config {String}
       */
      className: 'float-area',

      /**
       * @config {jQuery}
       */
      $body: $('body'),

      /**
       * @config {jQuery}
       */
      $target: null,

      /**
       * @config {jQuery}
       */
      $border: null,

      /**
       * @param  {Object} options
       * @param  {jQuery} options.$target
       */
      initialize: function(options) {
         var $el = options.$el;

         // Настроить всплывающую область
         if ($el && $el.length) {
            this.$el = $el;
            this.$el.addClass(this.className);
            this.$body.append(this.$el);
         }

         // Если передали target, то закиним в него панель
         this.setTarget(options.$target);

         this.setTargetBorder(options.$border);
      },

      /**
       * Установить target
       * @param  {jQuery} $target
       */
      setTarget: function($target) {
         if ($target && $target.length) {
            this.$target = $target;
            this.$el.css($target.offset());
         }
      },

      /**
       * Установить targetBorder
       * @param  {jQuery} $border
       */
      setTargetBorder: function($border) {
         if ($border && $border.length) {
            this.$border = $border;
            this.checkPosition();
         }
      },

      /**
       * Проверить не выходит ли панель за границу,
       * если выходит, то закинуть в границы
       */
      checkPosition: function() {
         var $border = this.$border;

         if ($border && $border.length) {
            var borderEl = borderElement(this.$el);
            var borderBorder = borderElement(this.$border);
            var isBorder = checkBorders(borderEl, borderBorder);

            if (isBorder.top) {
               this.$el.css('top', borderBorder.top);
            }

            if (isBorder.rigth) {
               this.$el.css('left', borderEl.left + (borderBorder.right - borderEl.right));
            }

            if (isBorder.bottom) {
               this.$el.css('top', borderEl.top + (borderBorder.bottom - borderEl.bottom));
            }

            if (isBorder.left) {
               this.$el.css('top', borderBorder.top);
            }
         }
      },

      /**
       * Оторбразить панель
       * @param  {jQuery} [$target]
       */
      show: function($target) {
         this.setTarget($target);

         if (this.$target) {
            this.$el.attr('data-show', 'true');
            this.checkPosition();
         }
      },

      /**
       * Скрыть панель
       */
      hide: function () {
         this.$el.attr('data-show', 'false');
      }
   });
});