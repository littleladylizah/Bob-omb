// ------------------
// Global variables
// ------------------

var GRID_SQUARES = 10;
var ELEMENT_BOAT = "boat";
var ELEMENT_PARTIAL_BOAT = "partial";
var ELEMENT_FORBIDDEN = "forbidden";
var DIRECTION_H = "horizontal";
var DIRECTION_V = "vertical";

var playerBoardElements = new Array(GRID_SQUARES);
var enemyBoardElements = new Array(GRID_SQUARES);
var boatsLeft = new Array(4);

var boatSelected = 0;
var drawnParts = 0;

var direction;
var turnOfPlayer;
var gameStarted = false;

// -----------------------
// Game state handling
// -----------------------

var resetGame = function() {
  boatSelected = 0;
  drawnParts = 0;
  gameStarted = false;

  for (i = 0; i < GRID_SQUARES; i++) {
    playerBoardElements[i] = new Array(GRID_SQUARES);
    enemyBoardElements[i] = new Array(GRID_SQUARES);
    enemyBoardElements[i][i] = ELEMENT_BOAT;
  }

  for (i = 0; i < 4; i++) {
    boatsLeft[i] = 4 - i;
  }

  resetCanvases();
};

var startGame = function() {
  removeForbidden();
  gameStarted = true;
  turnOfPlayer = 1;
};

var randomMove = function() {
  var randomX = Math.floor(Math.random()*10);
  var randomY = Math.floor(Math.random()*10);
  console.log("x: " + randomX + ", y: " + randomY);
  console.log(playerBoardElements[randomX][randomY]);
  if (playerBoardElements[randomX][randomY] == ELEMENT_BOAT) {
    drawHitBoat(true, randomX, randomY);
  }
  else {
    drawMiss(true, randomX, randomY);
  }
  turnOfPlayer= 1;
}

// ------------------------
// Boat positioning logic
// ------------------------

var clearSquare = function(x, y) {
  playerBoardElements[x][y] = null;
  drawEmpty(true, x, y);
};

var isOutOfBounds = function(x, y) {
  return x < 0 || y < 0 || x >= GRID_SQUARES || y >= GRID_SQUARES;
};

var hasBoat = function(x, y) {
  return !isOutOfBounds(x, y) && playerBoardElements[x][y] == ELEMENT_BOAT;
};

var isForbidden = function(x, y) {
  for (var i = x - 1; i <= x + 1; i++) {
    for (var j = y - 1; j <= y + 1; j++) {
      if (hasBoat(i, j)) {
        return true;
      }
    }
  }
};

var cancelCurrentBoat = function() {
  for (x = 0; x < GRID_SQUARES; x++) {
    for (y = 0; y < GRID_SQUARES; y++) {
      if (playerBoardElements[x][y] == ELEMENT_PARTIAL_BOAT) {
        clearSquare(x, y);
        if (x > 0 && y > 0 && !isForbidden(x - 1, y - 1)) {
          clearSquare(x - 1, y - 1);
        }
        if (x > 0 && y < GRID_SQUARES - 1 && !isForbidden(x - 1, y + 1)) {
          clearSquare(x - 1, y + 1);
        }
        if (x < GRID_SQUARES - 1 && y > 0 && !isForbidden(x + 1, y - 1)) {
          clearSquare(x + 1, y - 1);
        }
        if (x < GRID_SQUARES - 1 && y < GRID_SQUARES - 1 && !isForbidden(x + 1, y + 1)) {
          clearSquare(x + 1, y + 1);
        }
      }
    }
  }
};

var selectBoat = function(length) {
  cancelCurrentBoat();
  boatSelected = length;
  drawnParts = 0;
};

var forbidSquare = function(x, y) {
  if (!isOutOfBounds(x, y) && playerBoardElements[x][y] == null) {
    drawMiss(true, x, y);
    playerBoardElements[x][y] = ELEMENT_FORBIDDEN;
  }
};

var addForbiddenDiagonals = function(x, y) {
  forbidSquare(x - 1, y - 1);
  forbidSquare(x + 1, y - 1);
  forbidSquare(x - 1, y + 1);
  forbidSquare(x + 1, y + 1);
};

var addForbiddenEnds = function(x, y) {
  if (boatSelected == 1) {
    forbidSquare(x + 1, y);
    forbidSquare(x, y + 1);
    forbidSquare(x - 1, y);
    forbidSquare(x, y - 1);
    return;
  }

  if (direction == DIRECTION_H) {
    if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT) {
      forbidSquare(x + 1, y);
      forbidSquare(x - boatSelected, y);
      return;
    }
    if (x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT) {
      forbidSquare(x - 1, y);
      forbidSquare(x + boatSelected, y);
      return;
    }
  }

  if (direction == DIRECTION_V) {
    if (y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT) {
      forbidSquare(x, y + 1);
      forbidSquare(x, y - boatSelected);
      return;
    }
    if (y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT) {
      forbidSquare(x, y - 1);
      forbidSquare(x, y + boatSelected);
      return;
    }
  }
};

var isNextHorizontal = function(x, y) {
  return x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT
      || x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT;
};

var isNextVertical = function(x, y) {
  return y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT
      || y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT;
};

var isNextPart = function(x, y) {
  return isNextHorizontal(x, y) || isNextVertical(x, y);
};

var findDirection = function(x, y) {
  if (isNextHorizontal(x, y)) {
    return DIRECTION_H;
  } else if (isNextVertical(x, y)) {
    return DIRECTION_V;
  }
};

var finishBoat = function(x, y) {
  addForbiddenEnds(x, y);

  if (boatSelected == 1) {
    playerBoardElements[x][y] = ELEMENT_BOAT;
  } else if (direction == DIRECTION_H) {
    for (i = 0; i < GRID_SQUARES; i++) {
      if (playerBoardElements[i][y] == ELEMENT_PARTIAL_BOAT) {
        playerBoardElements[i][y] = ELEMENT_BOAT;
      }
    }
  } else if (direction == DIRECTION_V) {
    for (i = 0; i < GRID_SQUARES; i++) {
      if (playerBoardElements[x][i] == ELEMENT_PARTIAL_BOAT) {
        playerBoardElements[x][i] = ELEMENT_BOAT;
      }
    }
  }

  boatsLeft[boatSelected - 1] -= 1;
  boatSelected = 0;
  drawnParts = 0;
}

var removeForbidden = function() {
  for (x = 0; x < GRID_SQUARES; x++) {
    for (y = 0; y < GRID_SQUARES; y++) {
      if (playerBoardElements[x][y] == ELEMENT_FORBIDDEN) {
        clearSquare(x, y);
      }
    }
  }
};

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {

  console.log("game started: " + gameStarted);
  console.log("boat selected: " + boatSelected);
  console.log(playerBoardElements[x][y]);

  if (gameStarted) {
    return;
  }
  if (playerBoardElements[x][y] != null) {
    return;
  }
  if (boatSelected == 0) {
    return;
  }

  if (drawnParts == 0 || isNextPart(x, y)) {
    drawBoat(true, x, y);
    playerBoardElements[x][y] = ELEMENT_PARTIAL_BOAT;
    addForbiddenDiagonals(x, y);
    drawnParts += 1;

    if (drawnParts == 2) {
      direction = findDirection(x, y);
    }
    if (drawnParts == boatSelected) {
      finishBoat(x, y);
    }
  }
};

var handleEnemyCanvasClick = function(x, y) {
  if (turnOfPlayer != 1) {
    return;
  }
  if (enemyBoardElements[x][y] == null) {
    drawMiss(false, x, y);
    turnOfPlayer = 2;
    randomMove();
  } else {
    drawHitBoat(false, x, y);
  }
};

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
  if (x < 0 || x > GRID_SQUARES - 1 || y < 0 || y > GRID_SQUARES - 1) {
    return;
  }
  if (player) {
    handlePlayerCanvasClick(x, y);
  } else {
    handleEnemyCanvasClick(x, y);
  }
};

// ---------------------------
// Initialize on window load
// ---------------------------

$(window).load(function() {
  resetGame();
  gPlayerCanvas.click(function(e) {
    handleCanvasClick(true, e);
  });
  gEnemyCanvas.click(function(e) {
    handleCanvasClick(false, e);
  });
});
