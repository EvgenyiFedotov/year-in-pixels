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
       * Параметры для создания дочерних компонентов
       * @config {Object}
       * @config {Array.<String>} child.include
       * @config {Function} callback
       * @config {Array.<Object>} handlers
       * @config {Object} handler
       * @config {String} handler.event
       * @config {Function} handler.callback
       */
      _childs: {},

      /**
       * Дочерние представления
       * @config {Object}
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
       * @param {Boolean} [options.isShow]
       */
      initialize: function(options) {
         options = options instanceof Object ? options : {};

         // Классы по-умолчанию
         if (this.classNameDefault) {
            this.$el.addClass(this.classNameDefault);
         }

         this.childs = _.defaults({}, this.childs || {});

         // Темлейт
         this.template = options.template || this.template;

         // Роутер
         this.router = options.router || this.router;

         // Подписка на события по карте селекторов
         this.events = this.getEventsSelectors();

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
       */
      getEventsSelectors: function() {
         var events = _.isFunction(this.events)
            ? (this.events.call(this) || {})
            : (this.events || {});

         return _.reduce(events, function(result, value, key) {
            var keyArr = key.split(' ');
            var selector;

            if (keyArr.length == 2) {
               selector = this.selector(keyArr[1]);
               if (!!selector) {
                  result[keyArr[0] + ' ' + selector] = value;
               } else {
                  result[key] = value;
               }
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
       * Выполняется после рендерингом
       * @param {Object} params
       */
      _afterRender: function(params) {
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

            // Выполним обработчик после редерингом
            this._afterRender(params);
         }

         return this;
      },

      /**
       * Записать url
       * @param {String} url
       * @param {Object} [options]
       */
      navigate: function(url) {
         var args = Array.prototype.slice.call(arguments);

         if (this.router) {
            this.router.navigate.apply(this.router, args);
         }

         // Общее событие
         args.unshift('navigate');
         this.trigger.apply(this, args);

         // Событие с текущим url
         args[0] += ':' + url;
         this.trigger.apply(this, args);
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
       * Создать дочернее представление
       * @param {String} name
       * @param {Function} callback
       */
      createChild: function(name, callback) {
         var configChild = this._childs[name];

         if (configChild) {
            requirejs(configChild.include || [], function() {
               var args = Array.prototype.slice.call(arguments);
               var childNew;

               // Если уже существует такое дочернее предстваление, отпишимся от его событий
               // if (this.childs[name]) {
               //    this.stopListening(this.childs[name]);
               // }

               /**
                * Добавим callback, если будут зависимости внутри
                * создания дочернего представления
                * (Если был ассинхронный вызов)
                */
               args.push(function(childNew) {
                  // Вызовем jбработчик окончания создания дочернего представления
                  this._afterCreateChild(name, childNew, callback);
               }.bind(this));

               childNew = configChild.callback.apply(this, args) || null;

               // Вызовем jбработчик окончания создания дочернего представления
               this._afterCreateChild(name, childNew, callback);
            }.bind(this));
         }
      },

      /**
       * Обработчик окончания создания дочернего представления
       * @param {String} name
       * @param {View} childNew
       * @param {Function} callback
       */
      _afterCreateChild: function(name, childNew, callback) {
         if (name && childNew) {
            var childOld = this.childs[name];
            var config = this._childs[name];

            // Установим новое дочернее представление
            this.childs[name] = childNew;

            // Подписка / отписка на события представления
            this.listenToChild(name, childOld, childNew, config.handlers);

            // Вызовем обратню фунцию
            if (_.isFunction(callback)) {
               callback.call(this, childNew);
            }
         }
      },

      /**
       * Прослушивать события дочерего представления
       * @param {String} name
       * @param {View} [childOld]
       * @param {View} [childNew]
       * @param {Array.<Object>} [handlers]
       * @param {Object} handler
       * @param {String} handler.event
       * @param {Function} handler.callback
       */
      listenToChild: function(name, childOld, childNew, handlers) {
         if (name) {
            // Отписка от событий
            if (childOld) {
               this.stopListening(childOld);
            }

            /**
             * Если передали новое дочернее представление и его обработчики,
             * то подпишимся
             */
            if (childNew && handlers && handlers.length) {
               handlers.forEach(function(handler) {
                  this.listenTo(childNew, handler.event, handler.callback);
               }.bind(this));
            }
         }
      },

      /**
       * Загрузить, создать и получить экземпляр дочернего представления
       * @param {String} name
       * @param {Function} callback
       */
      child: function(name, callback) {
         var child = this.childs[name] || null;

         if (child && _.isFunction(callback)) {
            callback.call(this, child);
         } else {
            this.createChild(name, callback);
         }

         return child;
      }
   });
});