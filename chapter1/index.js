// var D = function () {}
// D.prototype = {
//   length: 2,
//   size: function () {
//     return this.length
//   }
// }
// var d = new D()

// var D = function () {
//   return A
// }
// var A = D.prototype = {
//   length: 2,
//   size: function () {
//     return this.length
//   }
// }

// var D = function () {
//   return D.fn
// }
// D.fn = D.prototype = {
//   length: 2,
//   size: function () {
//     return this.length
//   }
// }
// var D = function (selector) {
//   return D.fn.init(selector)
// }
// D.fn = D.prototype = {
//   length: 2,
//   init: function (selector) {
//     return document.getElementById(selector)
//   },
//   size: function () {
//     return this.length
//   }
// }
// var D = function (selector) {
//   return D.fn.init(selector)
// }
// D.fn = D.prototype = {
//   length: 2,
//   init: function (selector) {
//     this[0] = document.getElementById(selector)
//     this.length = 1
//     return this
//   },
//   size: function () {
//     return this.length
//   }
// }
// var D = function (selector) {
//   return new D.fn.init(selector)
// }
// D.fn = D.prototype = {
//   length: 1,
//   init: function (selector) {
//     this[0] = document.getElementById(selector)
//     this.length = 1
//     return this
//   },
//   size: function () {
//     return this.length
//   }
// }
// var D = function (selector) {
//   return new D.fn.init(selector)
// }
// D.fn = D.prototype = {
//   length: 1,
//   init: function (selector) {
//     this[0] = document.getElementById(selector)
//     this.length = 1
//     return this
//   },
//   size: function () {
//     return this.length
//   }
// }
// D.fn.init.prototype = D.fn
// var D = function (selector, context) {
//   return new D.fn.init(selector, context)
// }
// D.fn = D.prototype = {
//   constructor: D,
//   length: 0,
//   init: function (selector, context) {
//     this.length = 0
//     context = context || document
//     if (~selector.index('#')) {
//       this[0] = document.getElementById(selector.slice(1))
//       this.length = 1
//     } else {
//       var doms = context.getElementsByTagName(selector),
//           i = 0,
//           len = doms.length
//       for (; i < len; i ++) {
//         this[i] = doms[i]
//       }
//       this.length = len
//     }
//     this.context = context
//     this.selector = selector
//     return this
//   },
//   size: function () {
//     return this.length
//   }
// }
// D.fn.init.prototype = D.fn
var D = function (selector, context) {
  return new D.fn.init(selector, context)
}
D.fn = D.prototype = {
  length: 0,
  init: function (selector, context) {
    this.length = 0
    context = context || document
    if (~selector.indexOf('#')) {
      this[0] = document.getElementById(selector.slice(1))
      this.length = 1
    } else {
      var doms = context.getElementsByTagName(selector),
          i = 0,
          len = doms.length
      for (; i < len; i++) {
        this[i] = doms[i]
      }
      this.length = len
    }
    this.context = context
    this.selector = selector
  },
  size: function () {
    return this.length
  },
  push: [].push,
  sort: [].sort,
  splice: [].splice
}
D.fn.init.prototype = D.fn
D.extend = D.fn.extend = function () {
  var i = 1,
      len = arguments.length,
      target = arguments[0],
      j
  if (len === i) {
    target = this
    i--
  }
  for (; i < len; i++) {
    for (j in arguments[i]) {
      target[j] = arguments[i][j]
    }
  }
  return target
}