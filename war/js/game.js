// ------------------------
// Boat positioning logic
// ------------------------

var GRID_SQUARES = 10;
var ELEMENT_BOAT = "boat";
var ELEMENT_PARTIAL_BOAT = "partial";
var ELEMENT_FORBIDDEN = "forbidden";

var playerBoardElements = new Array(GRID_SQUARES);
var enemyBoardElements = new Array(GRID_SQUARES);
var boatsLeft = new Array(4);

var boatSelected = 0;
var drawnParts = 0;

var direction;
var turnOfPlayer;
var gameStarted = false;

for (i = 0; i < GRID_SQUARES; i++) {
  playerBoardElements[i] = new Array(GRID_SQUARES);
  enemyBoardElements[i] = new Array(GRID_SQUARES);
  enemyBoardElements[i][i] = ELEMENT_BOAT;
}

for (i = 0; i < 4; i++) {
  boatsLeft[i] = 4 - i;
}

var cancelCurrentBoat = function() {
  //TODO: vaja oleks funktsiooni ka laevade visuaalseks kustutamiseks laualt
  for (x = 0; x < GRID_SQUARES; x++) {
    for (y = 0; y < GRID_SQUARES; y++)
      if (playerBoardElements[x][y] == ELEMENT_PARTIAL_BOAT) {
        playerBoardElements[x][y] = null;
        if (x > 0 && y > 0) {
          playerBoardElements[x - 1][y - 1] = null;
        }
        if (x > 0 && y < GRID_SQUARES - 1) {
          playerBoardElements[x - 1][y + 1] = null;
        }
        if (x < GRID_SQUARES - 1 && y > 0) {
          playerBoardElements[x + 1][y - 1] = null;
        }
        if (x < GRID_SQUARES - 1 && y < GRID_SQUARES - 1) {
          playerBoardElements[x + 1][y + 1] = null;
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

var addForbiddenEnds = function(x, y, boatSelected) {
  if (direction == "horizontal" || boatSelected == 1) {

    if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT || boatSelected == 1) {
      if (x < GRID_SQUARES - 1) {
        forbidSquare(x + 1, y);
      }
      if (x - boatSelected >= 0) {
        forbidSquare(x - boatSelected, y);
      }
    }

    else if (x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT || boatSelected == 1) {
      if (x > 0) {
        forbidSquare(x - 1, y);
      }
      if (x + boatSelected < GRID_SQUARES) {
        forbidSquare(x + boatSelected, y);
      }
    }
  }

  if (direction == "vertical" || boatSelected == 1) {

    if (y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT || boatSelected == 1) {
      if (y < GRID_SQUARES - 1) {
        forbidSquare(x, y + 1);
      }
      if (y - boatSelected >= 0) {
        forbidSquare(x, y - boatSelected);
      }
    }

    else if (y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT || boatSelected == 1) {
      if (y > 0) {
        forbidSquare(x, y - 1);
      }
      if (y + boatSelected < GRID_SQUARES) {
        forbidSquare(x, y + boatSelected);
      }
    }
  }
};

var isNextPart = function(x, y) {
  if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT ||
    x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT ||
    y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT ||
    y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT) {

    return true;
    }
  else {
    return false;
  }
};

var findDirection = function(x, y) {
  if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_PARTIAL_BOAT ||
      x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_PARTIAL_BOAT) {

      return "horizontal";
    }

    else if (y > 0 && playerBoardElements[x][y - 1] == ELEMENT_PARTIAL_BOAT ||
        y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_PARTIAL_BOAT) {

      return "vertical";
    }
};

var finishBoat = function(x, y) {
  addForbiddenEnds(x, y, boatSelected);

      if (direction == "horizontal") {
        for (i = 0; i < GRID_SQUARES; i++) {
          if (playerBoardElements[i][y] == ELEMENT_PARTIAL_BOAT) {
            playerBoardElements[i][y] = ELEMENT_BOAT;
          }
        }
      }

      else if (direction == "vertical") {
        for (i = 0; i < GRID_SQUARES; i++) {
          if (playerBoardElements[x][i] == ELEMENT_PARTIAL_BOAT) {
            playerBoardElements[x][i] = ELEMENT_BOAT;
          }
        }
      }

      if (boatSelected == 1) {
        playerBoardElements[x][y] = ELEMENT_BOAT;
      }

      boatsLeft[boatSelected - 1] -= 1;
      boatSelected = 0;
      drawnParts = 0;
}

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {

  console.log("game started: " + gameStarted);
  console.log("boat selected: " + boatSelected);
  console.log(playerBoardElements[x][y]);

  if (gameStarted == true) {
    return;
  }

  if (playerBoardElements[x][y] != null) {
    return;
  }
  if (boatSelected == 0) {
    return;
  }
  if (drawnParts == 0 || isNextPart(x, y) == true) {
    drawBoat(true, x, y);
    playerBoardElements[x][y] = ELEMENT_PARTIAL_BOAT;
    addForbiddenElements(x,y);
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

var startGame = function() {
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
