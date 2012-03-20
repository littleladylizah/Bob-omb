// JavaScript needed for the sidebar

var movesLink;
var gamesLink;
var toggler;
var container;
var content;

var showMoves = function() {
  if (positioning) {
    return;
  }
  movesLink.removeClass("faded");
  gamesLink.addClass("faded");
  content.load("moves.html");
};

var showGames = function() {
  if (positioning) {
    return;
  }
  gamesLink.removeClass("faded");
  movesLink.addClass("faded");
  content.load("games.html");
};

var boatTypeClicked = function(clicked, size) {
  clicked.addClass("selected");
  $("#sidebar-content #delete-boats").removeClass("selected");
  selectBoat(size, $("#sidebar-content #boat" + size + "-left"), function() {
    clicked.removeClass("selected");
  });
};

var showBoats = function() {
  movesLink.addClass("faded");
  gamesLink.addClass("faded");
  content.load("boats.html", function() {
    $("#sidebar-content #boat4").click(function() {
      boatTypeClicked($(this), 4);
    });
    $("#sidebar-content #boat3").click(function() {
      boatTypeClicked($(this), 3);
    });
    $("#sidebar-content #boat2").click(function() {
      boatTypeClicked($(this), 2);
    });
    $("#sidebar-content #boat1").click(function() {
      boatTypeClicked($(this), 1);
    });
    $("#sidebar-content #delete-boats").click(function() {
      $("#sidebar-content .selected").removeClass("selected");
      $(this).addClass("selected");
      setDeleteMode();
    });
    $("#sidebar-content #confirm-boats").click(function() {
      if (startGame()) {
        showMoves();
      }
    });
  });
};

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
