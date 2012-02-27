// Utility functions
// Shamelessly stolen from http://code.google.com/edu/submissions/html-css-javascript/

// Event functions from http://www.quirksmode.org/js/eventSimple.html
var addEventSimple = function(el, evt, fn) {
  if (el.addEventListener) {
    el.addEventListener(evt, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + evt, fn);
  }
};
// alias
var addEvent = addEventSimple;

// Add/remove/has class functions from http://snipplr.com/view/3561/addclass-removeclass-hasclass/
var hasClass = function(ele, cls) {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

var addClass = function(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += " " + cls;
  }
}

var removeClass = function(ele, cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}
