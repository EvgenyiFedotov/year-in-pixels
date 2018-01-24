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
       * @config {Object}
       */
      offset: {},

      /**
       * @param {Object} options
       * @param {jQuery} options.$el
       * @param {jQuery} options.$target
       * @param {jQuery} options.$border
       * @param {Object} options.offset
       */
      initialize: function(options) {
         var $el = options.$el;

         // Настроить всплывающую область
         if ($el && $el.length) {
            this.$el = $el;
            this.$el.addClass('float-area ' + this.className);
            this.$el.attr('data-cid', this.cid);
            this.$body.append(this.$el);
         }

         // Если передали target, то закиним в него панель
         this.setTarget(options.$target);

         // Элемент ограницения
         this.setTargetBorder(options.$border);

         // Оффсет
         this.setOffset(options.offset);
      },

      /**
       * Подписаться на событие клика по body
       */
      _onClickBody: function() {
         // Обработчик на клик вне области всплывающей панели
         this.$body.on('click.click-body-' + this.cid, this._clickBody.bind(this));
      },

      /**
       * Отписать от события клика по body
       */
      _offClickBody: function() {
         this.$body.off('click.click-body-' + this.cid);
      },

      /**
       * Обработчик клика по body
       */
      _clickBody: function(e) {
         var $panel = $(e.target).closest('.float-area[data-cid="' + this.cid + '"]');

         // Скроем панель если кликнули не на нее
         if (!$panel.length) {
            this.hide();
         }
      },

      /**
       * Установить target
       * @param  {jQuery} $target
       */
      setTarget: function($target) {
         if ($target && $target.length) {
            this.$target = $target;
         }

         if (this.$target) {
            this.$el.css(this.$target.offset());
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
       * Установить оффсет
       * @param {Object} offset
       */
      setOffset: function(offset) {
         this.offset = offset instanceof Object ? offset : this.offset;

         var top = this.offset.top || 0;
         var left = this.offset.left || 0;

         this.$el.css('top', parseInt(this.$el.css('top')) + top);
         this.$el.css('left', parseInt(this.$el.css('left')) + left);
      },

      /**
       * Отобразить панель
       * @param {jQuery} [$target]
       * @param {Object} offset
       */
      show: function($target, offset) {
         this.setTarget($target);

         this.$el.attr('data-show', 'true');
         this.setOffset(offset);
         this.checkPosition();

         this.trigger('show');

         // Подпишимся на событие клика по body
         this._onClickBody();
      },

      /**
       * Скрыть панель
       */
      hide: function () {
         // Отпишимся от события клика по body
         this._offClickBody();
         this.$el.attr('data-show', 'false');
         this.trigger('hide');
      },

      /**
       * До переопределим удаление представления
       */
      remove: function() {
         // Отпишимся от события клика по body
         this._offClickBody();

         Backbone.View.prototype.remove(this, arguments);
      }
   });
});