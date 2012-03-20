// ------------------
// Global variables
// ------------------

var ELEMENT_BOAT = "boat";
var ELEMENT_HIT_BOAT = "hit-boat";
var ELEMENT_PARTIAL_BOAT = "partial";
var ELEMENT_FORBIDDEN = "forbidden";
var ELEMENT_MISS = "miss";
var DIRECTION_H = "horizontal";
var DIRECTION_V = "vertical";

var playerBoardElements = new Array(GRID_SQUARES);
var enemyBoardElements = new Array(GRID_SQUARES);
var boatsLeft = new Array(4);

var boatSelected = 0;
var drawnParts = 0;
var boatCounter;
var boatUnselectCallback;

var direction;
var turnOfPlayer;

var gameStarted = false;
var deleteMode = false;
var positioning = false;

// -----------------------
// Game state handling
// -----------------------

var resetGame = function() {
  boatSelected = 0;
  drawnParts = 0;
  gameStarted = false;
  positioning = false;

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

var startPositioning = function() {
  positioning = true;
};

var startGame = function() {
  if (!boatsLeft.every(function(val) { return val == 0; })) {
    return false;
  }
  removeForbidden();
  gameStarted = true;
  positioning = false;
  turnOfPlayer = 1;
  return true;
};

// --------------
// Temporary AI
// --------------

var enemyMove = function() {
  // Select a random square the AI hasn't bombed yet
  do {
    var randomX = Math.floor(Math.random()*10);
    var randomY = Math.floor(Math.random()*10);
  } while (playerBoardElements[randomX] != null
      && playerBoardElements[randomX][randomY] != null
      && (playerBoardElements[randomX][randomY] == ELEMENT_MISS
          || playerBoardElements[randomX][randomY] == ELEMENT_HIT_BOAT));

  console.log("x: " + randomX + ", y: " + randomY);
  console.log(playerBoardElements[randomX][randomY]);
  bombPlayer(randomX, randomY);
}

// ---------------
// Bombing logic
// ---------------

var bombPlayer = function(x, y) {
  if (playerBoardElements[x][y] == ELEMENT_BOAT) {
    playerBoardElements[x][y] = ELEMENT_HIT_BOAT;
    drawEmpty(true, x, y);
    drawHitBoat(true, x, y);
    enemyMove();
  } else {
    playerBoardElements[x][y] = ELEMENT_MISS;
    drawMiss(true, x, y);
    turnOfPlayer = 1;
  }
};

var bombEnemy = function(x, y) {
  if (enemyBoardElements[x][y] == ELEMENT_MISS) {
    return;
  }
  if (enemyBoardElements[x][y] == null) {
    enemyBoardElements[x][y] = ELEMENT_MISS;
    drawMiss(false, x, y);
    turnOfPlayer = 2;
    enemyMove();
  } else {
    enemyBoardElements[x][y] = ELEMENT_HIT_BOAT;
    drawHitBoat(false, x, y);
  }
};

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

var clearCurrentBoat = function() {
  for (x = 0; x < GRID_SQUARES; x++) {
    for (y = 0; y < GRID_SQUARES; y++) {
      if (!isOutOfBounds(x, y) && playerBoardElements[x][y] == ELEMENT_PARTIAL_BOAT) {
        clearSquare(x, y);
        if (!isForbidden(x - 1, y - 1)) {
          clearSquare(x - 1, y - 1);
        }
        if (!isForbidden(x - 1, y + 1)) {
          clearSquare(x - 1, y + 1);
        }
        if (!isForbidden(x + 1, y - 1)) {
          clearSquare(x + 1, y - 1);
        }
        if (!isForbidden(x + 1, y + 1)) {
          clearSquare(x + 1, y + 1);
        }
      }
    }
  }
  drawnParts = 0;
};

var selectBoat = function(length, counter, callback) {
  deleteMode = false;
  clearCurrentBoat();
  if (length != boatSelected && boatUnselectCallback != null) {
    boatUnselectCallback();
  }
  boatSelected = 0;
  boatCounter = null;
  boatUnselectCallback = null;

  if (boatsLeft[length - 1] <= 0) {
    callback();
    return;
  }
  boatCounter = counter;
  boatSelected = length;
  boatUnselectCallback = callback;
};

var setDeleteMode = function() {
  deleteMode = true;
  clearCurrentBoat();
}

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

var clearForbiddenDiagonals = function(x, y) {
  clearForbiddenSquare(x - 1, y - 1);
  clearForbiddenSquare(x + 1, y - 1);
  clearForbiddenSquare(x - 1, y + 1);
  clearForbiddenSquare(x + 1, y + 1);
};

var clearForbiddenSides = function(x, y) {
  clearForbiddenSquare(x - 1, y);
  clearForbiddenSquare(x + 1, y);
  clearForbiddenSquare(x, y + 1);
  clearForbiddenSquare(x, y - 1);
};

var clearForbiddenSquare = function(x, y) {
  if (!isOutOfBounds(x, y) && !isNextPart(x, y) && !isNextDiagonal(x, y)) {
    clearSquare(x, y);
  }
}

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
      || x > 0 && playerBoardElements[x - 1][y] ==  ELEMENT_BOAT
      || x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT
      || x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] ==  ELEMENT_BOAT;
};

var isNextVertical = function(x, y) {
  return y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT
      || y > 0 && playerBoardElements[x][y - 1] ==  ELEMENT_BOAT
      || y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT
      || y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] ==  ELEMENT_BOAT;
};

var isNextPart = function(x, y) {
  return isNextHorizontal(x, y) || isNextVertical(x, y);
};

var isNextDiagonal = function(x, y) {
  return !isOutOfBounds(x - 1, y - 1) && playerBoardElements[x - 1][y - 1] == ELEMENT_BOAT
      || !isOutOfBounds(x + 1, y - 1) && playerBoardElements[x + 1][y - 1] == ELEMENT_BOAT
      || !isOutOfBounds(x - 1, y + 1) && playerBoardElements[x - 1][y + 1] == ELEMENT_BOAT
      || !isOutOfBounds(x + 1, y + 1) && playerBoardElements[x + 1][y + 1] == ELEMENT_BOAT;
}

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
  boatCounter.text(boatsLeft[boatSelected - 1]);
  drawnParts = 0;

  // Unselect boat if we've run out of stock
  if (boatsLeft[boatSelected - 1] <= 0) {
    boatSelected = 0;
    boatCounter = null;
    boatUnselectCallback();
    boatUnselectCallback = null;
  }
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

var deleteBoat = function(x, y) {
  if (playerBoardElements[x][y] == ELEMENT_BOAT) {
  	direction = findDirection(x, y);
  	console.log("x=" + x + " y=" + y);
  	if (direction == DIRECTION_H) {
  	  for (i = x; i < GRID_SQUARES && playerBoardElements[i][y] != ELEMENT_FORBIDDEN; i++) {
  	  	clearSquare(i, y);
  	  	clearForbiddenDiagonals(i, y);
  	  	clearForbiddenSides(i, y);
  	  }
  	  for (i = x; i > 0 && playerBoardElements[i][y] != ELEMENT_FORBIDDEN; i--) {
  	  	clearSquare(i, y);
  	  	clearForbiddenDiagonals(i, y);
  	  	clearForbiddenSides(i, y);
  	  }
  	}
  	else if (direction == DIRECTION_V) {
  	  for (i = y; i < GRID_SQUARES && playerBoardElements[x][i] != ELEMENT_FORBIDDEN; i++) {
  	  	clearSquare(x, i);
  	  	clearForbiddenDiagonals(x, i);
  	  	clearForbiddenSides(x, i);
  	  }
  	  for (i = y; i > 0 && playerBoardElements[x][i] != ELEMENT_FORBIDDEN; i--) {
  	  	clearSquare(x, i);
  	  	clearForbiddenDiagonals(x, i);
  	  	clearForbiddenSides(x, i);
  	  }
  	}
  	else {
  	  clearSquare(x, y);
  	  clearForbiddenDiagonals(x, y);
  	  clearForbiddenSides(x, y);
}
  }
}

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {

  console.log(playerBoardElements[x][y]);

  if (gameStarted || deleteMode || playerBoardElements[x][y] != null || boatSelected == 0) {
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
  bombEnemy(x, y);
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

var handleDeleteBoat = function(e) {
  if (!deleteMode) {
    return;
  }
  var pos = getMousePosition(e);
  var x = Math.floor((pos[0] - PLAYER_OFF_X) / SQUARE_SIZE);
  var y = Math.floor((pos[1] - PLAYER_OFF_Y) / SQUARE_SIZE);
  if (x < 0 || x > GRID_SQUARES - 1 || y < 0 || y > GRID_SQUARES - 1) {
    return;
  }
  else {
  	deleteBoat(x, y);
  }
}

// ---------------------------
// Initialize on window load
// ---------------------------

$(window).load(function() {
  resetGame();
  startPositioning();
  gPlayerCanvas.click(function(e) {
    handleCanvasClick(true, e);
  });
  gEnemyCanvas.click(function(e) {
    handleCanvasClick(false, e);
  });
  gPlayerCanvas.click(function(e) {
    handleDeleteBoat(e);
  });
});
