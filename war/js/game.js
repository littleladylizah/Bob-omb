// ------------------------
// Boat positioning logic
// ------------------------

var GRID_SQUARES = 10;
var ELEMENT_BOAT = "boat";
var ELEMENT_FORBIDDEN = "forbidden";

var playerBoardElements = new Array(GRID_SQUARES);
var enemyBoardElements = new Array(GRID_SQUARES);

var boatSelected = 0;

for (i = 0; i < GRID_SQUARES; i++) {
  playerBoardElements[i] = new Array(GRID_SQUARES);
  enemyBoardElements[i] = new Array(GRID_SQUARES);
  enemyBoardElements[i][i] = ELEMENT_BOAT;
}

var cancelCurrentBoat = function() {
  // TODO lõpeta praeguse laeva asetamine
};

var selectBoat = function(length) {
  cancelCurrentBoat();
  boatSelected = length;
};

var forbidSquare = function(x, y) {
  if (playerBoardElements[x][y] == null) {
    drawMiss(true, x, y);
    playerBoardElements[x][y] = ELEMENT_FORBIDDEN;
  }
};

var addForbiddenElements = function(x, y) {
  if (x > 0 && y > 0) {
    forbidSquare(x - 1, y - 1);
  }

  if (x < GRID_SQUARES - 1 && y > 0) {
    forbidSquare(x + 1, y - 1);
  }

  if (x > 0 && y < GRID_SQUARES - 1) {
    forbidSquare(x - 1, y + 1);
  }

  if (x < GRID_SQUARES - 1 && y < GRID_SQUARES - 1) {
    forbidSquare(x + 1, y + 1);
  }
};

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {
  if (playerBoardElements[x][y] != null) {
    return;
  }
  drawBoat(true, x, y);
  playerBoardElements[x][y] = ELEMENT_BOAT;
  addForbiddenElements(x,y);
}

var handleEnemyCanvasClick = function(x, y) {
  if (enemyBoardElements[x][y] == null) {
    drawMiss(false, x, y);
  } else {
    drawHitBoat(false, x, y);
  }
}

/* function from http://stackoverflow.com/a/5417934 */
var getMousePosition = function(e) {
  var canoff = $(e.target).offset();
  var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoff.left);
  var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoff.top) + 1;

  return [x, y];
};

var handleCanvasClick = function(player, e) {
  var pos = getMousePosition(e);
  var x = Math.floor((pos[0] - (player ? PLAYER_OFF_X : ENEMY_OFF_X)) / SQUARE_SIZE);
  var y = Math.floor((pos[1] - (player ? PLAYER_OFF_Y : ENEMY_OFF_Y)) / SQUARE_SIZE);
  if (x < 0 || x > 9 || y < 0 || y > 9) {
    return;
  }
  if (player) {
    handlePlayerCanvasClick(x, y);
  } else {
    handleEnemyCanvasClick(x, y);
  }
}

// ---------------------------
// Initialize on window load
// ---------------------------

$(window).load(function() {
  gPlayerCanvas.click(function(e) {
    handleCanvasClick(true, e);
  });
  gEnemyCanvas.click(function(e) {
    handleCanvasClick(false, e);
  });
});
