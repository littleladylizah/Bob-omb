var miss = new Image();
miss.src = "img/cross.png";

var boatSingle = new Image();
boatSingle.src = "img/boat-single.png";

var boatLeft = new Image();
boatLeft.src = "img/boat-left.png";

var boatMiddleHit = new Image();
boatMiddleHit.src = "img/boat-middle-hit.png";

var boatRightHit = new Image();
boatRightHit.src = "img/boat-right-hit.png";

// Temporary code to test <canvas>
var drawPlayer = function() {
  var canvas = document.getElementById("player-canvas");
  var ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(20, 0);
  ctx.drawImage(boatSingle, 40, 40);
  ctx.drawImage(boatLeft, 40 * 7, 40 * 5);
  ctx.drawImage(boatRightHit, 40 * 8, 40 * 5);
  ctx.drawImage(miss, 120, 200);
  ctx.drawImage(miss, 200, 280);
  ctx.drawImage(miss, 160, 320);
  ctx.restore();
};

var drawEnemy = function() {
  var canvas = document.getElementById("enemy-canvas");
  var ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(0, 20);
  ctx.drawImage(boatMiddleHit, 40 * 5, 40 * 2);
  ctx.drawImage(boatMiddleHit, 40 * 6, 40 * 2);
  ctx.drawImage(boatRightHit, 40 * 7, 40 * 2);
  ctx.drawImage(miss, 80, 200);
  ctx.drawImage(miss, 240, 120);
  ctx.drawImage(miss, 160, 320);
  ctx.translate(40 * 5, 40 * 3);
  ctx.rotate(Math.PI);
  ctx.drawImage(boatRightHit, 0, 0);
  ctx.rotate(Math.PI / 2);
  ctx.translate(40 * -3, 40);
  ctx.drawImage(boatRightHit, 0, 0);
  ctx.rotate(Math.PI);
  ctx.translate(0, -40);
  ctx.drawImage(boatRightHit, 0, 0);
  ctx.restore();
};

var drawTest = function() {
  drawPlayer();
  drawEnemy();
};

addEvent(window, "load", drawTest);
