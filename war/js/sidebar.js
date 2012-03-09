// JavaScript needed for the sidebar

var movesLink;
var gamesLink;
var toggler;
var container;
var content;

var showMoves = function() {
  movesLink.removeClass("faded");
  gamesLink.addClass("faded");
  content.load("moves.html");
};

var showGames = function() {
  gamesLink.removeClass("faded");
  movesLink.addClass("faded");
  content.load("games.html");
};

var showBoats = function() {
  movesLink.addClass("faded");
  gamesLink.addClass("faded");
  content.load("boats.html");
}

$(window).load(function() {
  // Select the needed elements
  movesLink = $("#sidebar-moves");
  gamesLink = $("#sidebar-games");
  toggler = $("#sidebar-toggle");
  container = $("#sidebar-container");
  content = $("#sidebar-content");

  // Attach listener to toggler
  toggler.click(function () {
    container.toggleClass("sidebar-on sidebar-off");
  });

  // Attach listeners to links
  movesLink.click(showMoves);
  gamesLink.click(showGames);

  // Default to showing boats on open
  showBoats();
});
