# dQuery
深入理解jquery原理，并跟随练习，以期望深入学习javascript

## jquery 整体架构
我们使用`jquery`进行编码时，发现通过点语法就可以使用多个方法，这就是链式调用，这种链模式是基于原型继承的，并且在每一个原型方法的实现上都返回当前对象`this`,使当前对象一直处于原型链作用域的顶端
### jquery 的原型式继承
```
var D = function () {}
D.prototype = {
  length: 2,
  size: function () {
    return this.length
  }
}
```
在上面的代码中创建了一个对象D,并且在D的原型上添加了属性`length`与方法`size`,那么我们想访问这个方法该怎么办呢？

由于方法在`D`的原型上，所以应该通过`new`关键字创建新对象来方法，如下：
```
var d = new D()
console.log(d.size())
```
但是如果通过下面两种方式访问就会报错：
- `console.log(D.size())`
- `console.log(D().size())`
第一种方式报错的原因是因为`size`绑定在原型上而没有绑定在自身上，第二种方式报错的原因是`D`执行的结果是没有返回值的所以在其中找不到`size`方法。但是在`jquery`中可以直接根据`$()`的方式访问，这是为什么呢？

根据上面代码得出的结论，我们可以知道这是因为`jquery`在执行`$()`后返回了一个带有比如`size`方法的对象，就可以像`D().size()`调用,如下：
```
var D = function () {
  return A
}
var A = D.prototype = {
  length: 2,
  size: function () {
    return this.length
  }
}
```
按照上面的代码，在D执行之后将A返回，A中含有size等方法可以调用，所以就根可以根据`D().size()`来执行，在`jquery`中，为了减少变量，直接将`A`对象看做是`D`的一个属性设置。如下：
```
var D = function () {
  return D.fn
}
D.fn = D.prototype = {
  length: 2,
  size: function () {
    return this.length
  }
}
```
到这里，就遇到一个新的问题，我们都知道`jQuery`的`$()`是为了获取元素，返回一组元素，但是现在返回的却是一个`D.fn`对象，显然不能达到我们的要求，我们试想一下，如果在 `D.fn`中添加一个可以获取元素的方法，也就是在`D.prototype`中添加一个获取元素的方法，然后将此方法获取的数据返回到`D`中就可以了，但是这样又有一个问题就是，调用`D()`返回的是元素了，就不在返回含有方法的`D.fn`了，后面就不能再获取其他的方法进行调用，这怎么办呢，我们先一步一步思考，
- 首先，第一步，获取节点元素
```
var D = function (selector) {
  return D.fn.init(selector)
}
D.fn = D.prototype = {
  length: 2,
  init: function (selector) {
    return document.getElementById(selector)
  },
  size: function () {
    return this.length
  }
}
console.log(D('app'))
```
- 第二步，修改代码，将含有方法的原型对象返回
在第一步中我们返回了需要的节点元素，但是不能返回`D.prototype`也就是`D.fn`了，那怎么办呢，我们想一下，既然要返回`D.fn`也就是在执行`init`方法之后要将`this`对象返回出去，所以`init`最后应该`return this`，但是我们所需要的节点怎么获取呢，我们刚刚为了减少变量，在`D`上面添加了一个属性`fn`来指向`D`的原型，那么我们想要获取的节点能不能也添加在`D`的属性上面呢，我们尝试一下：
```
var D = function (selector) {
  return D.fn.init(selector)
}
D.fn = D.prototype = {
  length: 2,
  init: function (selector) {
    this[0] = document.getElementById(selector)
    this.length = 1
    return this
  },
  size: function () {
    return this.length
  }
}
var form = D('form') //{0: form#form.fm, length: 1, init: ƒ, size: ƒ}
console.log(form)
```
上面的代码解决了我们的问题，即可以获取到含有方法的对象，也可以获取到我们所想要的节点，但是我们多测试几遍后会发现问题：
```
var form = D('form')
var s_form = D('s_fm')
console.log(form) // {0: div#s_fm.s_form, length: 1, init: ƒ, size: ƒ}
console.log(s_form) // {0: div#s_fm.s_form, length: 1, init: ƒ, size: ƒ}
```
上面的代码我们发现后面的元素覆盖了前面的元素，这是由于我们每次都调用`D.fn.init`来获取，它指向的`this`的是一个值也就是`D.fn.init`，所以后面获取的元素会覆盖前面的元素，`D.fn`里面的方法也是被共用的，为了解决这个问题，我们可以使用`new`关键字，使用后每调用一次`D()`就会创建一个新的实例，其`this`就会指向这个新实例，就不会有被覆盖的问题。
```
var D = function (selector) {
  return new D.fn.init(selector)
}
D.fn = D.prototype = {
  length: 1,
  init: function (selector) {
    this[0] = document.getElementById(selector)
    this.length = 1
    return this
  },
  size: function () {
    return this.length
  }
}
var form = D('form')
console.log(form) 
//form#form.fm
//length:1
//__proto__:Object
```
但是这样又会出现一个问题，就是找不到我们所想要的`size`等方法了，只有`init`中的属性，这是为什么呢？主要是因为我们在进行实例的时候使用`new`操作符，这个`new`操作符只会实例当前的构造函数，也就是`D.fn.init`,返回的`this`值也就是实例后的`D.fn.init`，所以就找不到我们所需要的方法。所以，为了解决这个问题，我们需要将`D.fn.init`的原型指向`D.fn`即可，这样我们需要的`D.fn`中的方法都可以在`D.fn.init`的实例中的原型中找到，代码如下：
```
var D = function (selector) {
  return new D.fn.init(selector)
}
D.fn = D.prototype = {
  length: 1,
  init: function (selector) {
    this[0] = document.getElementById(selector)
    this.length = 1
    return this
  },
  size: function () {
    return this.length
  }
}
D.fn.init.prototype = D.fn
var form = D('form')
console.log(form) 
//init {0: form#form.fm, length: 1}
//0:form#form.fm
//length:1
//__proto__:
//  init:ƒ (selector)
//  length:1
//  size:ƒ ()
//  __proto__:Object
```
上面的代码中我们所需要的想要的方法或者属性出现的实例的`__proto__`属性中.

### 丰富的元素获取
根据`jQuery`我们来丰富一下我们自己的元素获取代码:
```
var D = function (selector, context) {
  return new D.fn.init(selector, context)
}
D.fn = D.prototype = {
  constructor: D,
  length: 0,
  init: function (selector, context) {
    this.length = 0
    <!-- 默认获取元素的上下文为document -->
    context = context || document
    <!-- 如果是id选择符 将其按位转化为0 否则为-1 Boolean(-1) === true Boolean(0) === false -->
    if (~selector.indexOf('#')) {
      this[0] = document.getElementById(selector.slice(1))
      this.length = 1
    } else {
      var doms = context.getElementsByTagName(selector),
          i = 0,
          len = doms.length
      for (; i < len; i ++) {
        this[i] = doms[i]
      }
      this.length = len
    }
    <!-- 保存上下文 -->
    this.context = context
    <!-- 保存选择符 -->
    this.selector = selector
    return this
  },
  size: function () {
    return this.length
  }
}
D.fn.init.prototype = D.fn
```
### 数组与对象
在`jQuery`中获取的元素更像是一个数组，而`D`获取返回的更像是一个对象，如果我们也想要数组的形式返回要怎么办呢？在`javascript`中，它是一个弱类型的语言，并且数组、对象、函数都被看做为对象的实例，所以在`js`中并没有一个纯粹的数组类型。而且`js`引擎的实现也没有做严格的校验，也是基于对象实现的。一些浏览器解析引擎在判断对象是否是数组的时候不仅仅判断其有没有`length`属性，可否通过‘[索引值]’方式访问元素，还会判断其是否具有数组方法来确定是否要用数组的形式展现，所以我们只需要在`D.fn`中添加几个数组常用的方法来增强数组特性就可以了，如下：
```
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
```
现在调用`D()`打印出来的数据格式是数组类型
### 方法拓展
在`jQuery`中定义了一个`extend`方法，不仅可以用来对外部拓展对象，也可以对内部拓展对象，根据这个原理我们可以简单实现`extent`方法：如果只有一个参数就定义为对`D`对象或者`D.fn`对象的拓展，对`D.fn`对象的拓展是因为我们使用`D()`返回对象中的方法是从`D.fn`上获取的，如果有多个参数，则后面的参数是对第一个参数的拓展。代码如下：
```
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
```