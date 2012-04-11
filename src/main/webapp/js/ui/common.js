// ---------------------
// Common UI functions
// ---------------------

$(window).load(function() {
  $("#player-title").text(g_playerID);
  setShowResultFunction(showResult);
  registerTurnChangeListener(function(turn) {
    if (turn == 1) {
      $("#player-title").addClass("player-turn");
      $("#enemy-title").removeClass("player-turn");
    } else if (turn == 2) {
      $("#player-title").removeClass("player-turn");
      $("#enemy-title").addClass("player-turn");
    } else {
      $("#player-title").removeClass("player-turn");
      $("#enemy-title").removeClass("player-turn");
    }
  });
});

var showResult = function(result) {
   $("#fuzz").css("height", $(document).height());
   $("#fuzz").fadeIn();
   if (result) {
     $("#result").text("Sinu võit!");
     $("#result").slideDown();
   }
   else {
     $("#result").text("Sinu kaotus.");
     $("#result").slideDown();
   }
   
   $("#fuzz").click( function() {
     $("#fuzz").fadeOut();
     $("#result").slideUp();
   });
   
   $("#result").click( function() {
     $("#fuzz").fadeOut();
     $("#result").slideUp();
   });
};
