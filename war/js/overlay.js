// Script to display overlays

$(function() {
  $("a[rel]").overlay({
    mask: '#f0f0d8',
    effect: 'apple',

    onBeforeLoad: function() {
      var wrap = this.getOverlay().find(".contentWrap");
      wrap.load(this.getTrigger().attr("href"));
    }
  });
});
