// ------------------------------------------------------
// Global variables and constants also used in input.js
// ------------------------------------------------------

var SQUARE_SIZE = 40;
var PLAYER_OFF_X = 20;
var PLAYER_OFF_Y = 0;
var ENEMY_OFF_X = 0;
var ENEMY_OFF_Y = 20;

var gPlayerCanvas;
var gEnemyCanvas;

// -----------------
// Load the images
// -----------------

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

// -------------------
// Drawing functions
// -------------------

var resetCanvases = function() {
  // 420 is hard-coded into index.html so let's do it here too
  gPlayerCanvas[0].getContext("2d").clearRect(0, 0, 420, 420);
  gEnemyCanvas[0].getContext("2d").clearRect(0, 0, 420, 420);
};

var doOnCanvas = function(player, callback) {
  // The following works because JavaScript has no block scope
  if (player) {
    var ctx = gPlayerCanvas[0].getContext("2d");
    var offX = PLAYER_OFF_X;
    var offY = PLAYER_OFF_Y;
  } else {
    var ctx = gEnemyCanvas[0].getContext("2d");
    var offX = ENEMY_OFF_X;
    var offY = ENEMY_OFF_Y;
  }

  ctx.save();
  ctx.translate(offX, offY);
  callback(ctx);
  ctx.restore();
};

var drawEmpty = function(player, x, y) {
  doOnCanvas(player, function(ctx) {
    ctx.clearRect(SQUARE_SIZE * x, SQUARE_SIZE * y, SQUARE_SIZE, SQUARE_SIZE);
  });
};

var drawImage = function(image, player, x, y) {
  doOnCanvas(player, function(ctx) {
    ctx.clearRect(SQUARE_SIZE * x, SQUARE_SIZE * y, SQUARE_SIZE, SQUARE_SIZE);
    ctx.drawImage(image, SQUARE_SIZE * x, SQUARE_SIZE * y);
  });
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

// ---------------------------
// Initialize on window load
// ---------------------------

$(window).load(function() {
  gPlayerCanvas = $("#player-canvas");
  gEnemyCanvas = $("#enemy-canvas");
});
