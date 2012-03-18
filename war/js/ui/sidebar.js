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
  content.load("boats.html", function() {
    $("#sidebar-content #boat4").click(function() {
      selectBoat(4, $("#sidebar-content #boat4-left"));
    });
    $("#sidebar-content #boat3").click(function() {
      selectBoat(3, $("#sidebar-content #boat3-left"));
    });
    $("#sidebar-content #boat2").click(function() {
      selectBoat(2, $("#sidebar-content #boat2-left"));
    });
    $("#sidebar-content #boat1").click(function() {
      selectBoat(1, $("#sidebar-content #boat1-left"));
    });
    $("#sidebar-content #confirm-boats").click(function() {
      startGame();
    })
  });
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
