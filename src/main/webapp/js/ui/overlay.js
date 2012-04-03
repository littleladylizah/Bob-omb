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

$("div.lobby li, #new-game").click(function() {
  $("a[rel]").overlay({api: true}).close();
  showBoats();
});
