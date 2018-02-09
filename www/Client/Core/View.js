define(function() {
   'use strict';

   return Backbone.View.extend({
      /**
       * Классы по-умолчанию
       * @config {String}
       */
      classNameDefault: '',

      /**
       * Шаблон
       * @config {Function}
       */
      template: null,

      /**
       * Роутер
       * @config {Backbone.Router}
       */
      router: null,

      /**
       * Карта селекторов
       * @config {Object}
       */
      selectors: {},

      /**
       * События по карте селекторов
       * @config {Object|Function}
       */
      eventsSelectors: {},

      /**
       * Дочерние представления
       */
      childs: {},

      /**
       * Индикатор отображения представления
       * @config {Boolean}
       */
      isShow: true,

      /**
       * @param {Object} options
       * @param {Function} [options.template]
       * @param {Boolean} [options.firstRender]
       * @param {Object|Function} [options.eventsSelectors]
       * @param {Boolean} [options.isShow]
       */
      initialize: function(options) {
         options = options instanceof Object ? options : {};

         // Классы по-умолчанию
         if (this.classNameDefault) {
            this.$el.addClass(this.classNameDefault);
         }

         // Темлейт
         this.template = options.template || this.template;

         // Роутер
         this.router = options.router || this.router;

         // Подписка на события по карте селекторов
         this.delegateEvents(this.getEventsSelectors(options.eventsSelectors));

         // Отображение представления
         this.isShow = _.isBoolean(options.isShow) ? options.isShow : !!this.isShow;

         // Обработчик ининциализации перед рендерингом
         this._init(options);

         // Установим само отображение
         this.dataShow(this.isShow, false);

         // Произведем рендер, если это необходимо
         if (options.firstRender !== false) {
            this.render(options);
         }
      },

      /**
       * Обработчик ининциализации перед рендерингом
       * @param {Object} options
       */
      _init: function(options) {
         // code...
      },

      /**
       * Получить хэш событий по селекторам
       * @param {Object|Function} eventsSelectors
       */
      getEventsSelectors: function(eventsSelectors) {
         eventsSelectors = _.defaults({},
            (_.isFunction(eventsSelectors)
               ? (eventsSelectors.call(this) || {})
               : (eventsSelectors || {})
            ),
            (_.isFunction(this.eventsSelectors)
               ? (this.eventsSelectors.call(this) || {})
               : (this.eventsSelectors || {})
            ),
            (_.isFunction(this.events)
               ? (this.events.call(this) || {})
               : (this.events || {})
            )
         );

         return _.reduce(eventsSelectors, function(result, value, key) {
            var keyArr = key.split(' ');

            if (keyArr.length == 2) {
               result[keyArr[0] + ' ' + this.selector(keyArr[1])] = value;
            } else {
               result[key] = value;
            }

            return result;
         }, {}, this);
      },

      /**
       * Выполняется перед рендерингом
       * @param {Object} params
       */
      _beforeRender: function(params) {
         // code...
      },

      /**
       * Рендер
       * @param {Object} [params]
       */
      render: function(params) {
         if (this.template) {
            params = params instanceof Object ? params : {};

            params.model = params.model || this.model;

            // Выполним обработчик перед редерингом
            this._beforeRender(params);

            this.$el.html(this.template(params || {}));
         }

         return this;
      },

      /**
       * Записать url
       * @param {String} url
       * @param {Object} [options]
       */
      navigate: function() {
         if (this.router) {
            this.router.navigate.apply(this.router, arguments);
         }
      },

      /**
       * Получить селектор по ключу
       * @param {String} key
       */
      selector: function(key) {
         return this.selectors[key] || key;
      },

      /**
       * Получить jQuery объект по ключу из карты селекторов
       * @param {String} key
       */
      $element: function(key) {
         return this.$(this.selector(key));
      },

      /**
       * Сменить отображения jQuery объекта
       * @param {String} key
       * @param {Boolean} value
       */
      $elementDataShow: function(key, value) {
         this.$element(key).attr('data-show', value);
      },

      /**
       * Сменить отображение
       * @param {Boolean} value
       * @param {Boolean} isTrigger
       */
      dataShow: function(value, isTrigger) {
         value = !!value;

         this.isShow = value;

         this.$el.attr('data-show', value);

         // Нужно ли сообщать об изменении режима отображения
         if (isTrigger !== false) {
            this.trigger(value === false ? 'hide' : 'show');
         }
      },

      /**
       * Дополнительный обработчик
       */
      _show: function() {
         // code...
      },

      /**
       * Отобразить предастваление
       */
      show: function() {
         this._show.apply(this, arguments);
         this.dataShow(true);
      },

      /**
       * Дополнительный обработчик
       */
      _hide: function() {
         // code...
      },

      /**
       * Скрыть предастваление
       */
      hide: function() {
         this._hide.apply(this, arguments);
         this.dataShow(false);
      },

      /**
       * Загрузить, создать и получить экземпляр дочернего представления
       * @param {String} name
       * @param {Function} callback
       * @param {Array.<String>} load
       */
      child: function(name, callback, load) {
         var child = this.childs[name] || null;

         if (_.isFunction(callback)) {
            requirejs(load || [], callback.bind(this, child));
         }

         return child;
      }
   });
});