"use strict";
var jQuery = function (selector, context) {
  return new jQuery.fn.init(selector, context);
}

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,

  init: function () {
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
var extend = {}
jQuery.extend(true, extend, {
  num: 1,
  arr: [[1, 2, 3], 'a', 'b', 'c'],
  obj: {
    o: 'o',
    b: 'b',
    j: 'j'
  }
})
console.log(extend)
