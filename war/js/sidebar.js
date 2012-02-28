// Script needed to toggle the sidebar
// Shamelessly stolen from http://code.google.com/edu/submissions/html-css-javascript/

var toggleSidebar = function() {
  var sidebar = document.getElementById("sidebar-container");
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

// Script to swap sidebar content
var showHistory = function(moves) {
  var movesLink = document.getElementById("moves");
  var gamesLink = document.getElementById("games");

  if (moves) {
    removeClass(movesLink, "faded");
    addClass(gamesLink, "faded");
  } else {
    removeClass(gamesLink, "faded");
    addClass(movesLink, "faded");
  }
  // TODO stub
};

var showMoves = function() {
  showHistory(true);
};

var showGames = function() {
  showHistory(false);
};

// Attach listeners to links
addEvent(window, "load", function() {
  addEvent(document.getElementById("moves"), "click", showMoves);
  addEvent(document.getElementById("games"), "click", showGames);
});
