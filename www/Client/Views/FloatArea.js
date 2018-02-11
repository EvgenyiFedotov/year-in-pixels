define([
   'Core/View',
   'Views/FloatArea/Helpers',
   'theme!css!Views/FloatArea/Style'
], function(View, helpers) {
   'use sctrict';

   var $body = $('body');

   return View.extend({
      classNameDefault: 'float-area',

      /**
       * Всплывающая область
       * @config {jQuery}
       */
      $area: null,

      /**
       * Таргет
       * @config {jQuery}
       */
      $target: null,

      /**
       * Смещение относительно таргета
       * @config {Object}
       */
      offset: null,

      /**
       * Граница в виде контейнера, за которую нельзя выходить
       * @config {jQuery}
       */
      $border: null,

      /**
       * Дополнительные аттрибуты
       * @config {Object}
       */
      attributes: {
         'data-shadow': true
      },

      /**
       * Автозакрытие
       * @config {Boolean}
       */
      autoHide: true,

      /**
       * @config {Boolean}
       */
      isShow: false,

      /**
       * Определим дополнительный обработчик инициализации
       * @param {Object} options
       * @param {Backbone.View|jQuery} options.area
       * @param {jQuery} options.target
       * @param {Object} options.offset
       * @param {jQuery} options.border
       * @param {Boolean} options.autoHide
       */
      _init: function(options) {
         // Всплывающая область
         if (options.area instanceof Backbone.View) {
            this.$area = options.area.$el;
         } else if (options.area) {
            this.$area = options.area;
         }

         // Таргет
         this.setTarget(options.target || this.$target);

         // Оффсет
         this.offset = _.isObject(options.offset)
            ? options.offset
            : ( _.isObject(this.offset) ? this.offset : {} );

         // Бордер
         this.$border = options.border || this.$border;

         // Установим область в контейнер представления
         if (this.$area) {
            this.$el.append(this.$area);
         }

         // Установим флаг автоматического закрытия
         this.autoHide = _.isBoolean(options.autoHide)
            ? options.autoHide
            : !!this.autoHide;

         // Установим sid в аттрибуты представления
         this.$el.attr('data-cid', this.cid);

         // Установим контейнер представления в $body
         $body.append(this.$el);
      },

      /**
       * Подписаться на событие клика по body
       */
      _onClickBody: function() {
         // Обработчик на клик вне области всплывающей панели
         $body.on('click.click-body-' + this.cid, this._clickBody.bind(this));
      },

      /**
       * Отписаться от события клика по body
       */
      _offClickBody: function() {
         $body.off('click.click-body-' + this.cid);
      },

      /**
       * Обработчик клика по body
       */
      _clickBody: function(e) {
         // Если автозакрытие, то просто закроем
         if (this.autoHide) {
            this.hide();
         } else {
            var $panel = $(e.target).closest('.float-area[data-cid="' + this.cid + '"]');

            // Скроем панель если кликнули не на нее
            if (!$panel.length) {
               this.hide();
            }
         }
      },

      /**
       * Установить таргет
       * @param {jQuery} $target
       */
      setTarget: function($target) {
         if ($target && $target.length) {
            this.$target = $target;
            this.$el.css(this.$target.offset());
         }
      },

      /**
       * Установить бордер
       * @param  {jQuery} $border
       */
      setBorder: function($border) {
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
            var borderEl = helpers.borderElement(this.$el);
            var borderBorder = helpers.borderElement(this.$border);
            var isBorder = helpers.checkBorders(borderEl, borderBorder);

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
         if (_.isObject(offset)) {
            var $el = this.$el;

            this.offset = offset;

            $el.css('top', parseInt($el.css('top')) + (offset.top || 0));
            $el.css('left', parseInt($el.css('left')) + (offset.left || 0));
         }
      },

      /**
       * Обработчик отображения
       * @param {jQuery} [$target]
       * @param {Object} [offset]
       */
      _show: function($target, offset) {
         if (this.isShow === false) {
            // Установим таргет
            this.setTarget($target);

            // Установим оффест
            this.setOffset(_.isObject(offset) ? offset : this.offset);

            // Проверим позицию относительно бордера
            this.checkPosition();

            /**
             * Подпишимся на событие клика по body
             * (используем setTimeout, чтобы сразу не скрыть панель)
             */
            setTimeout(function() {
               this._onClickBody();
            }.bind(this), 0);
         }
      },

      /**
       * Обработчик отображения
       */
      _hide: function() {
         if (this.isShow === true) {
            // Отпишимся от события клика по body
            this._offClickBody();
         }
      }
   });
});