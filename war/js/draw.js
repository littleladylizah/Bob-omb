// Temporary code to test <canvas>
var drawOnCanvas = function(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "3em sans-serif";
  ctx.fillText("This is a canvas", 0, 0);
  ctx.restore();
};

var drawTest = function() {
  drawOnCanvas(document.getElementById("player-canvas"));
  drawOnCanvas(document.getElementById("enemy-canvas"));
};

addEvent(window, "load", drawTest);
