// ------------------------------------------------------
// Global variables and constants also used in input.js
// ------------------------------------------------------

var SQUARE_SIZE = 40;
var PLAYER_OFF_X = 20;
var PLAYER_OFF_Y = 0;
var ENEMY_OFF_X = 0;
var ENEMY_OFF_Y = 20;

var DRAWN_BOAT_SINGLE = "boat-single";
var DRAWN_BOAT_MIDDLE_H = "boat-middle-horizontal";
var DRAWN_BOAT_MIDDLE_V = "boat-middle-vertical";
var DRAWN_BOAT_TOP = "boat-top";
var DRAWN_BOAT_RIGHT = "boat-right";
var DRAWN_BOAT_BOTTOM = "boat-bottom";
var DRAWN_BOAT_LEFT = "boat-left";

var playerDrawn;
var enemyDrawn;

var gPlayerCanvas;
var gEnemyCanvas;

// -----------------
// Load the images
// -----------------

var miss = new Image();
miss.src = "img/cross.png";

var boatSingle = new Image();
boatSingle.src = "img/boat-single.png";

var boatSingleHit = new Image();
boatSingleHit.src = "img/boat-single-hit.png";

var boatMiddleH = new Image();
boatMiddleH.src = "img/boat-middle-horizontal.png";

var boatMiddleHHit = new Image();
boatMiddleHHit.src = "img/boat-middle-horizontal-hit.png";

var boatMiddleV = new Image();
boatMiddleV.src = "img/boat-middle-vertical.png";

var boatMiddleVHit = new Image();
boatMiddleVHit.src = "img/boat-middle-vertical-hit.png";

var boatTop = new Image();
boatTop.src = "img/boat-up.png";

var boatTopHit = new Image();
boatTopHit.src = "img/boat-up-hit.png";

var boatLeft = new Image();
boatLeft.src = "img/boat-left.png";

var boatLeftHit = new Image();
boatLeftHit.src = "img/boat-left-hit.png";

var boatBottom= new Image();
boatBottom.src = "img/boat-down.png";

var boatBottomHit = new Image();
boatBottomHit.src = "img/boat-down-hit.png";

var boatRight= new Image();
boatRight.src = "img/boat-right.png";

var boatRightHit = new Image();
boatRightHit.src = "img/boat-right-hit.png";

// -------------------
// Utility functions
// -------------------

var resetCanvases = function() {
  // 420 is hard-coded into index.html so let's do it here too
  gPlayerCanvas[0].getContext("2d").clearRect(0, 0, 420, 420);
  gEnemyCanvas[0].getContext("2d").clearRect(0, 0, 420, 420);
  playerDrawn = null;
  enemyDrawn = null;
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

// --------------------------------------------------
// Functions for handling objects drawn on canvases
// --------------------------------------------------

var setDrawn = function(player, x, y, value) {
  var board = player ? playerDrawn : enemyDrawn;

  // The boards are lazily initialized, so create them if needed
  if (board == null) {
    board = new Array(GRID_SQUARES);
  }
  if (board[x] == null) {
    board[x] = new Array(GRID_SQUARES);
  }

  board[x][y] = value;
  if (player) {
    playerDrawn = board;
  } else {
    enemyDrawn = board;
  }
};

var getDrawn = function(player, x, y) {
  var board = player ? playerDrawn : enemyDrawn;
  return board != null && board[x] != null ? board[x][y] : null;
};

var hasDrawn = function(player, x, y) {
  return getDrawn(player, x, y) != null;
};

var getPieceToDraw = function(player, x, y) {
  var adjacent = 0;
  if (hasDrawn(player, x - 1, y)) {
    adjacent = 1;
  } else if (hasDrawn(player, x, y - 1)) {
    adjacent = 2;
  }
  if (hasDrawn(player, x + 1, y)) {
    return adjacent == 1 ? DRAWN_BOAT_MIDDLE_H : DRAWN_BOAT_LEFT;
  } else if (hasDrawn(player, x, y + 1)) {
    return adjacent == 2 ? DRAWN_BOAT_MIDDLE_V : DRAWN_BOAT_TOP;
  }
  switch (adjacent) {
    case 1: return DRAWN_BOAT_RIGHT;
    case 2: return DRAWN_BOAT_BOTTOM;
    default: return DRAWN_BOAT_SINGLE;
  }
};

// -------------------
// Drawing functions
// -------------------

var drawEmpty = function(player, x, y) {
  setDrawn(player, x, y, null);
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

var drawBoatPiece = function(player, x, y, piece, hit) {
  switch (piece) {
    case DRAWN_BOAT_MIDDLE_H:
      var img = hit ? boatMiddleHHit : boatMiddleH;
      break;

    case DRAWN_BOAT_MIDDLE_V:
      var img = hit ? boatMiddleVHit : boatMiddleV;
      break;

    case DRAWN_BOAT_TOP:
      var img = hit ? boatTopHit : boatTop;
      break;

    case DRAWN_BOAT_RIGHT:
      var img = hit ? boatRightHit : boatRight;
      break;

    case DRAWN_BOAT_BOTTOM:
      var img = hit ? boatBottomHit : boatBottom;
      break;

    case DRAWN_BOAT_LEFT:
      var img = hit ? boatLeftHit : boatLeft;
      break;

    default:
      var img = hit ? boatSingleHit : boatSingle;
  }
  drawImage(img, player, x, y);
};

var redrawSquare = function(player, x, y, hit) {
  if ((!player || !hit) && hasDrawn(player, x, y)) {
    drawBoat(player, x, y, hit, true);
  }
};

// hit and redrawing are optional
var drawBoat = function(player, x, y, hit, redrawing) {
  var piece = getPieceToDraw(player, x, y);
  setDrawn(player, x, y, piece);

  hit = Boolean(hit); // set hit to false if it was undefined
  drawBoatPiece(player, x, y, piece, hit);
  if (!redrawing) {
    doForSides(x, y, function(x, y) {
      redrawSquare(player, x, y, hit);
    });
  }
};

var drawHitBoat = function(player, x, y) {
  drawBoat(player, x, y, true);
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
