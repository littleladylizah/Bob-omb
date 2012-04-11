// Script to display overlays

$(function() {
  var timer = null;

  var poll = function(url) {
    $("#overlay #content-wrap").load(url);
    timer = setTimeout(function() {
      poll(url);
    }, 2000);
  };

  var stopPolling = function() {
    clearTimeout(timer);
  };

  $("a[rel]").overlay({
    mask: '#f0f0d8',
    effect: 'apple',

    onBeforeLoad: function() {
      poll(this.getTrigger().attr("href"));
    },

    onBeforeClose: function() {
      clearTimeout(timer);
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
