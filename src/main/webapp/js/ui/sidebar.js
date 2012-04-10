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

var showBoats = function() {
  movesLink.addClass("faded");
  gamesLink.addClass("faded");
  content.load("boats.html", function() {
    clearBoatCountListeners();
    for (var i = 1; i < 5; i++) {
      (function() {
        var size = i; // necessary for the closure
        $("#sidebar-content #boat" + size).click(function() {
          var clicked = $(this);
          clicked.addClass("selected");
          $("#sidebar-content #delete-boats").removeClass("selected");
          selectBoat(size, $("#sidebar-content #boat" + size + "-left"), function() {
            clicked.removeClass("selected");
          });
        });
        registerBoatCountListener(size, function(count) {
          $("#sidebar-content #boat" + size + "-left").text(count);
        });
      })();
    }

    $("#sidebar-content #delete-boats").click(function() {
      $("#sidebar-content .selected").removeClass("selected");
      $(this).addClass("selected");
      setDeleteMode();
    });
    $("#sidebar-content #confirm-boats").click(function() {
      if (startGame()) {
        showMoves();
        toggler.click();
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
