/* Global variables also used in input.js */
var gPlayerCanvas;
var gEnemyCanvas;
var gGridSize = 40;
var gPlayerOffX = 20;
var gPlayerOffY = 0;
var gEnemyOffX = 0;
var gEnemyOffY = 20;

var boatSingle = new Image();
boatSingle.src = "img/boat-single.png";

var boatSingleHit = new Image();
boatSingleHit.src = "img/boat-single-hit.png";

var miss = new Image();
miss.src = "img/cross.png";

//var boatLeft = new Image();
//boatLeft.src = "img/boat-left.png";

//var boatMiddleHit = new Image();
//boatMiddleHit.src = "img/boat-middle-hit.png";

//var boatRightHit = new Image();
//boatRightHit.src = "img/boat-right-hit.png";

var drawImage = function(image, player, x, y) {
  // The following works because JavaScript has no block scope
  if (player) {
    var ctx = gPlayerCanvas[0].getContext("2d");
    var offX = gPlayerOffX;
    var offY = gPlayerOffY;
  } else {
    var ctx = gEnemyCanvas[0].getContext("2d");
    var offX = gEnemyOffX;
    var offY = gEnemyOffY;
  }

  ctx.save();
  ctx.translate(offX, offY);
  ctx.drawImage(image, gGridSize * x, gGridSize * y);
  ctx.restore();
};

var drawBoat = function(player, x, y) {
  drawImage(boatSingle, player, x, y);
};

var drawHitBoat = function(player, x, y) {
  drawImage(boatSingleHit, player, x, y);
};

var drawMiss = function(player, x, y) {
  drawImage(miss, player, x, y);
};

/*
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
*/

$(window).load(function() {
  gPlayerCanvas = $("#player-canvas");
  gEnemyCanvas = $("#enemy-canvas");
});
