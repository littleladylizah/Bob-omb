// Script needed to toggle the sidebar
// Shamelessly stolen from http://code.google.com/edu/submissions/html-css-javascript/

var toggleSidebar = function() {
  var sidebar = document.getElementById("sidebar-content");
  if (hasClass(sidebar, "sidebar-off")) {
    removeClass(sidebar, "sidebar-off");
    addClass(sidebar, "sidebar-on");
  } else {
    removeClass(sidebar, "sidebar-on");
    addClass(sidebar, "sidebar-off");
  }
};

// Attach listener to toggler
addEvent(window, "load", function() {
  var toggler = document.getElementById("sidebar-toggle");
  addEvent(toggler, "click", toggleSidebar);
});
