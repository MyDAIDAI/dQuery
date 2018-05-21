define([
  "./var/class2type",
  "./var/toString",
  "./var/isFunction",
  "./var/isWindow",
  "./core/toType",
], function (class2type, toString, isFunction, isWindow, toType) {
  "use strict";

  var jQuery = function (selector, context) {
    return new jQuery.fn.init(selector, context);
  }

  var rootjQuery;
  var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,

    init: function (selector, context, root) {
      var match, elem;
      // HANDLE: $(""),$(null),$(undefined),$(false)
      if (!selector) {
        return this;
      }
      root = root || rootjQuery;

      if (typeof selector === 'string') {
        if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
          match = [null, selector, null];
        } else {
          match = rquickExpr.exec(selector);
        }

        if (match && (match[1] || !context)) {
          if (match[1]) {
            context = context instanceof jQuery ? context[0] : context
            // TODO
          }
        }
      }
      return this;
    }
  }
  jQuery.extend = jQuery.fn.extend = function () {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    if (typeof target === 'boolean') {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }

    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }

    if (i === length) {
      target = this;
      i--;
    }
    for (;i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];

          if (target === copy) {
            continue;
          }

          if (deep && copy && ((copyIsArray = Array.isArray(copy) || (typeof copy === 'object')))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && (typeof src === 'object') ? src : {};
            }
            target[name] = jQuery.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }
  jQuery.extend({
    error: function (msg) {
      throw new Error(msg);
    },
    isEmptyObject: function (obj) {
      var name;
      for (name in  obj) {
        return false;
      }
      return true;
    },
    each: function (obj, callback) {
      var length, i = 0;
      if (isArrayLike(obj)) {
        length = obj.length;
        for (; i < length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      } else {
        for (i in obj) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            break;
          }
        }
      }
      return obj;
    },
    trim: function (text) {
      return text == null ? "" : (text + "").replace(rtrim, "");
    },
    // 将second合并到first上，类似于push方法，类数组对象使用
    merge: function (first, second) {
      var len = +second.length,
        j = 0,
        i = first.length;

      for (; j < len; j++) {
        first[i++] = second[j]
      }
      first.length = i;
      return first;
    }
  });
  // 将数据类型加入class2type
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  })
  function isArrayLike(obj) {
    var length = !!obj && "length" in obj && obj.length,
      type = toType(obj);
    if (isFunction(obj) || isWindow(obj)) {
      return false;
    }
    return type === 'array' || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
  }
  return jQuery;
});
