// Handle clicks on the canvases

/* http://stackoverflow.com/a/5417934 */
var getMousePosition = function(e) {
  var canoff = $(e.target).offset();
  var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoff.left);
  var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoff.top) + 1;

  return [x, y];
};

var handlePlayerCanvasClick = function(x, y) {
  drawBoat(true, x, y);
}

var handleEnemyCanvasClick = function(x, y) {
  drawHitBoat(false, x, y);
}

var handleCanvasClick = function(player, e) {
  var pos = getMousePosition(e);
  var x = Math.floor((pos[0] - (player ? gPlayerOffX : gEnemyOffX)) / gGridSize);
  var y = Math.floor((pos[1] - (player ? gPlayerOffY : gEnemyOffY)) / gGridSize);
  if (x < 0 || x > 9 || y < 0 || y > 9) {
    return;
  }
  if (player) {
    handlePlayerCanvasClick(x, y);
  } else {
    handleEnemyCanvasClick(x, y);
  }
}

$(window).load(function() {
  gPlayerCanvas.click(function(e) {
    handleCanvasClick(true, e);
  });
  gEnemyCanvas.click(function(e) {
    handleCanvasClick(false, e);
  });
});
