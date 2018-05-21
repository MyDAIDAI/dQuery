define([
  "../var/class2type",
  "../var/toString"
], function (class2type, toString) {
  "use strict";
  function toType(obj) {
    if (obj == null) {
      return obj + "";
    }
    // 判断一个类型是否是"object"或"function",是的话就在class2type中寻找
    // 若找到，则返回其对应的值，若没有找到，则返回"object"，不是"object"或
    // "function"就直接进行判断
    return typeof obj === "object" || typeof obj === "function" ?
      class2type[toString.call(obj)] || "object" : typeof obj
  }
  return toType;
})