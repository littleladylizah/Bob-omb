// Script to display overlays

$(function() {
  $("a[rel]").overlay({
    mask: '#f0f0d8',
    effect: 'apple',

    onBeforeLoad: function() {
      var wrap = this.getOverlay().find("#content-wrap");
      wrap.load(this.getTrigger().attr("href"));
    }
  });
});

var setOpponentName = function(name) {
  $("#enemy-title").text(name);
};

$("div.lobby li.opponent-link").click(function() {
  $("a[rel]").overlay({api: true}).close();
  showBoats();
  joinGame($(this).text(), setOpponentName);
});

$("div.lobby #new-game").click(function() {
  $("a[rel]").overlay({api: true}).close();
  showBoats();
  createNewGame(setOpponentName);
});
