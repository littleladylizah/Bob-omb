// Temporary code to test <canvas>
window.onload = function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  ctx.save();
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "3em sans-serif";
  ctx.fillText("This is our canvas", 0, 0);
  ctx.restore();
};
