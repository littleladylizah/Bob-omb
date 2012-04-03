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
var boatCountCallbacks = [];

var direction;
var turnOfPlayer;
var turnChangeCallbacks = [];

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
  enemyBoardElements[1][0] = ELEMENT_BOAT;
  enemyBoardElements[1][1] = null;

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
  setTurnOfPlayer(1);
  return true;
};

var registerTurnChangeListener = function(callback) {
  turnChangeCallbacks.push(callback);
};

var setTurnOfPlayer = function(player) {
  turnOfPlayer = player;
  turnChangeCallbacks.forEach(function(callback) {
    callback(player);
  });
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
  window.setTimeout(bombPlayer, 500, randomX, randomY);
}

// ---------------
// Bombing logic
// ---------------

var hitSquare = function(board, x, y) {
  var squares = getBoatSquares(board, x, y);
  if (squares.every(function(coords) {
        return board[coords[0]][coords[1]] == ELEMENT_HIT_BOAT;
      })) {
    squares.forEach(function(coords) {
      drawSunken(board == playerBoardElements, coords[0], coords[1]);
    });
  }
};

var bombPlayer = function(x, y) {
  if (playerBoardElements[x][y] == ELEMENT_BOAT) {
    playerBoardElements[x][y] = ELEMENT_HIT_BOAT;
    drawEmpty(true, x, y);
    drawHitBoat(true, x, y);
    hitSquare(playerBoardElements, x, y);
    enemyMove();
  } else {
    playerBoardElements[x][y] = ELEMENT_MISS;
    drawMiss(true, x, y);
    setTurnOfPlayer(1);
  }
};

var bombEnemy = function(x, y) {
  if (enemyBoardElements[x][y] == ELEMENT_MISS) {
    return;
  }
  if (enemyBoardElements[x][y] == null) {
    enemyBoardElements[x][y] = ELEMENT_MISS;
    drawMiss(false, x, y);
    setTurnOfPlayer(2);
    enemyMove();
  } else {
    enemyBoardElements[x][y] = ELEMENT_HIT_BOAT;
    drawHitBoat(false, x, y);
    hitSquare(enemyBoardElements, x, y);
  }
};

// ------------------------
// Boat utility functions
// ------------------------

// Returns all the coordinates of the target boat
var getBoatSquares = function(board, x, y, elements) {
  if (!elements) {
    elements = [ELEMENT_BOAT, ELEMENT_HIT_BOAT];
  }
  if (elements.indexOf(board[x][y]) < 0) {
    return [];
  }

  var getNewSides = function(x, y, prev) {
    return getSides(x, y).filter(function(coords) {
      return elements.indexOf(board[coords[0]][coords[1]]) >= 0
          && (coords[0] != prev[0] || coords[1] != prev[1]);
    });
  };

  var findConnected = function(squares, coords, prev) {
    squares.push(coords);
    getNewSides(coords[0], coords[1], prev).forEach(function(child) {
      findConnected(squares, child, coords);
    });
    return squares;
  };

  return findConnected([], [x, y], [null, null]);
};

// ------------------------
// Boat positioning logic
// ------------------------

var clearBoatCountListeners = function() {
  boatCountCallbacks = [];
};

var registerBoatCountListener = function(size, listener) {
  boatCountCallbacks.push([size, listener]);
};

var setBoatsLeft = function(size, left) {
  boatsLeft[size - 1] = left;
  boatCountCallbacks.forEach(function(pair) {
    if (pair[0] == size) {
      pair[1](left);
    }
  });
};

var increaseBoatsLeft = function(size) {
  setBoatsLeft(size, boatsLeft[size - 1] + 1);
};

var decreaseBoatsLeft = function(size) {
  setBoatsLeft(size, boatsLeft[size - 1] - 1);
};

var isForbidden = function(x, y) {
  return getAdjacent(x, y).some(function(coords) {
    return playerBoardElements[coords[0]][coords[1]] == ELEMENT_BOAT;
  });
};

var clearSquare = function(x, y) {
  playerBoardElements[x][y] = null;
  drawEmpty(true, x, y);
};

var forbidSquare = function(x, y) {
  if (!isOutOfBounds(x, y) && playerBoardElements[x][y] == null) {
    drawMiss(true, x, y);
    playerBoardElements[x][y] = ELEMENT_FORBIDDEN;
  }
};

var clearForbiddenSquare = function(x, y) {
  if (!isForbidden(x, y)) {
    clearSquare(x, y);
  }
}

var addForbiddenDiagonals = function(x, y) {
  doForDiagonals(x, y, forbidSquare);
};

var addForbiddenEnds = function(x, y) {
  if (boatSelected == 1) {
    doForSides(x, y, forbidSquare);
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

var removeForbidden = function() {
  doForAll(function(x, y) {
    if (playerBoardElements[x][y] == ELEMENT_FORBIDDEN) {
      clearSquare(x, y);
    }
  });
};

var isNextHorizontal = function(x, y) {
  return x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT
      || x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT
};

var isNextVertical = function(x, y) {
  return y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT
      || y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT
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

var clearCurrentBoat = function() {
  doForAll(function(x, y) {
    if (playerBoardElements[x][y] == ELEMENT_PARTIAL_BOAT) {
      clearSquare(x, y);
      doForDiagonals(x, y, clearForbiddenSquare);
    }
  });
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

var deleteBoat = function(x, y) {
  var squares = getBoatSquares(playerBoardElements, x, y);
  if (squares.length > 0) {
    squares.forEach(function(coords) {
      clearSquare(coords[0], coords[1]);
      doForAdjacent(coords[0], coords[1], clearForbiddenSquare);
    });
    increaseBoatsLeft(squares.length);
  }
}

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

  decreaseBoatsLeft(boatSelected);
  drawnParts = 0;

  // Unselect boat if we've run out of stock
  if (boatsLeft[boatSelected - 1] <= 0) {
    boatSelected = 0;
    boatCounter = null;
    boatUnselectCallback();
    boatUnselectCallback = null;
  }
}

var putBoat = function(x, y) {
  if (playerBoardElements[x][y] != null || boatSelected == 0) {
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

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {

  console.log(playerBoardElements[x][y]);

  if (gameStarted) {
    return;
  }

  if (deleteMode) {
    deleteBoat(x, y);
  } else {
    putBoat(x, y);
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
});
