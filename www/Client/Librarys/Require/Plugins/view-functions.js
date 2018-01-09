(function() {
   define(function () {
      'use strict';

      return {
         attsElement: function (element, callback) {
            if (element.hasAttributes()) {
               var attributes = element.attributes;
               for (var index = 0; index < attributes.length; index++) {
                  if (_.isFunction(callback)) {
                     callback(attributes[index], index, attributes);
                  }
               }
            }
            return element;
         },
         /**
          * @param {String} prefix
          * @param {DOMElement} element
          */
         prefixDataElement: function (prefix, element) {
            prefix = prefix ? prefix + '-' : '';

            var result = {};
            this.attsElement(element, function (attribut) {
               var name = attribut.name;
               var indexPrefix = name.indexOf(prefix);
               if (indexPrefix !== -1) {
                  name = name.substr(indexPrefix + prefix.length, name.length);
                  name = name.toUpperCaseAttr(0);

                  result[name] = attribut.value;
               }
            });
            return result;
         },
         /**
          * @param {DOMElement} view
          * @param {Object} instances
          * @param {Object} views
          */
         objView: function (element) {
            return {
               instance: element.getAttribute('instance'),
               view: element.getAttribute('view'),
               tag: element.getAttribute('tag'),
               data: this.prefixDataElement('data', element),
               params: this.prefixDataElement('params', element)
            };
         },
         /**
          * @param {DOMElement} element
          * @param {Function} instance
          * @param {String} tag
          */
         setupElement: function (element, instance, tag) {
            var el = document.createElement(
               instance.prototype.el
               || tag
               || 'div'
            );

            element.after(el);
            element.remove();

            return el;
         },
         /**
          * @param {Object} options
          * @param {DOMElement} options.element
          * @param {String} options.tag
          * @param {Object} options.viewParams
          * @param {Object} options.objView
          * @param {Object} options.buildOptions
          * @param {Function} options.callback
          * @param {Function} instance
          */
         newInstance: function (options, instance) {
            options.viewParams.el = this.setupElement(
               options.element,
               instance,
               options.tag
            );

            var viewParams = options.viewParams;
            var callback = options.callback;
            var view = new instance(viewParams);

            view.render();

            if (_.isFunction(callback)) {
               callback(
                  view,
                  viewParams,
                  options.objView,
                  options.buildOptions
               );
            }

            return view;
         },
         /**
          * @param {Object} options
          * @param {DOMElement} options.element
          * @param {Object} options.params
          * @param {Object} options.context
          * @param {Function} options.callback
          */
         buildView: function (options) {
            var element = options.element;
            var params = options.params;
            var context = options.context;
            var callback = options.callback;
            var instances = _.defaults({}, context.instances, params.instances);
            var views = _.defaults({}, context.views, params.views);
            var objView = this.objView(element);
            var instance = objView.instance;
            var viewParams = {};
            var viewInViews = (objView.view && objView.view in views)
               ? _.value(views[objView.view], context)
               : {};

            objView.params = _.mapObject(objView.params, function (value, key) {
               return params[value];
            });

            _.defaults(
               viewParams,
               objView.data,
               objView.params,
               viewInViews
            );

            if (instance.toUpperCaseAttr(0) in instances) {
               instance = instances[instance.toUpperCaseAttr(0)];
            } else {
               instance = _.toPathView(instance);
            }

            if (typeof instance === 'string') {
               requirejs([instance], this.newInstance.bind(this, {
                  element: element,
                  tag: objView.tag,
                  viewParams: viewParams,
                  objView: objView,
                  buildOptions: options,
                  callback: callback
               }));
            } else {
               this.newInstance.call(this, {
                  element: element,
                  tag: objView.tag,
                  viewParams: viewParams,
                  objView: objView,
                  buildOptions: options,
                  callback: callback
               }, instance);
            }
         },
         /**
          * Функция формирования шаблона
          * @param {Function} template
          * @param {Object} params
          * @param {Object} context
          */
         template: function (template, params, context) {
            context = context || {};
            params = params || {};
            var $template = $(template);
            var $views = $template.find('view');
            var inEl = _.isFunction(context.inEl)
               ? context.inEl.bind(context)
               : function ($template) {
                  this.$el.empty();
                  this.$el.append($template);
                  return this;
               }.bind(context);
            var result = _.extend({
               template: template,
               $template: $template,
               $views: $views,
               childs: []
            }, Backbone.Events)
            var viewLength = $views.length;

            context.el.view = context;
            inEl(result.$template);

            $views.each(function (index, element) {
               this.buildView({
                  element: element,
                  params: params,
                  context: context,
                  callback: function (view) {
                     result.childs.push(view);
                     context.childs.push(view);
                     view.parent = context;
                     element.view = view;

                     var args = _.values(_.clone(arguments));
                     args.unshift('builded:view');
                     result.trigger.apply(result, args);

                     viewLength--;
                     if (viewLength === 0) {
                        result.trigger('builded:end', result);
                     }
                  }
               });
            }.bind(this));

            return result;
         }
      }
   });
})();