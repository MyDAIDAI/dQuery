export function isWindow(obj) {
  "use strict";
  return obj != null && obj === obj.window;
}