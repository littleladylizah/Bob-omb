// ---------------------
// Common UI functions
// ---------------------

$(window).load(function() {
  registerTurnChangeListener(function(turn) {
    if (turn == 1) {
      $("#player-title").addClass("player-turn");
      $("#enemy-title").removeClass("player-turn");
    } else {
      $("#player-title").removeClass("player-turn");
      $("#enemy-title").addClass("player-turn");
    }
  });
});
