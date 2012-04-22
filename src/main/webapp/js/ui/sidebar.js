// JavaScript needed for the sidebar

var gamesLink;
var toggler;
var container;
var boatsTab;
var replayTab;

var showReplay = function() {
  if (positioning) {
    return;
  }
  gamesLink.removeClass("faded");
  boatsTab.addClass("hidden");
  replayTab.removeClass("hidden");
};

var showBoats = function() {
  gamesLink.addClass("faded");
  boatsTab.removeClass("hidden");
  replayTab.addClass("hidden");
};

var refreshGameHistory = function() {
  var games = [];
  getGames().forEach(function(game) {
    games.push("<li>" + game.id + "</li>");
  });
  $("#sidebar-replay ul").html(games.join(''));
};

$(window).load(function() {
  // Select the needed elements
  gamesLink = $("#sidebar-games");
  toggler = $("#sidebar-toggle");
  container = $("#sidebar-container");
  boatsTab = $("#sidebar-boats");
  replayTab = $("#sidebar-replay");

  // Register boat positioning elements
  for (var i = 1; i < 5; i++) {
    (function() {
      var size = i; // necessary for the closure
      $("#sidebar-boats #boat" + size).click(function() {
        var clicked = $(this);
        clicked.addClass("selected");
        $("#sidebar-boats #delete-boats").removeClass("selected");
        selectBoat(size, $("#sidebar-boats #boat" + size + "-left"), function() {
          clicked.removeClass("selected");
        });
      });

      registerBoatCountListener(size, function(count) {
        $("#sidebar-boats #boat" + size + "-left").text(count);
      });
    })();
  }

  $("#sidebar-boats #delete-boats").click(function() {
    $("#sidebar-boats .selected").removeClass("selected");
    $(this).addClass("selected");
    setDeleteMode();
  });

  $("#sidebar-boats #confirm-boats").click(function() {
    if (startGame()) {
      toggler.click();
    }
  });

  // Attach listener to toggler
  toggler.click(function() {
    if (!gameStarted) {
      container.toggleClass("sidebar-on sidebar-off");
    }
  });

  // Attach listeners to links
  gamesLink.click(showReplay);

  // Default to showing boats on open
  showBoats();

  // Register refresh listener and do the first load
  registerStorageCallback(refreshGameHistory);
  refreshGameHistory();
});
