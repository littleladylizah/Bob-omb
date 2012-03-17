// ------------------------
// Boat positioning logic
// ------------------------

var GRID_SQUARES = 10;
var ELEMENT_BOAT = "boat";
var ELEMENT_FORBIDDEN = "forbidden";
var DIRECTION;

var playerBoardElements = new Array(GRID_SQUARES);
var enemyBoardElements = new Array(GRID_SQUARES);

var boatSelected = 0;
var drawnParts = 0;

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
  console.log("Boat selected: " + boatSelected);
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
  if (DIRECTION == "horizontal" || boatSelected == 1) {
  	
  	if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_BOAT || boatSelected == 1) {
  	  if (x < GRID_SQUARES - 1) {
  	    drawMiss(true, x + 1, y);
  	  }
  	  if (x - boatSelected >= 0) {	
  	    drawMiss(true, x - boatSelected, y);
  	  }
  	}
  	
  	else if (x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_BOAT || boatSelected == 1) {
  	  if (x > 0) {
  	    drawMiss(true, x - 1, y);
  	  }
  	  if (x + boatSelected < GRID_SQUARES) {
  	  	drawMiss(true, x + boatSelected, y);
  	  }
  	}
  }
  
  if (DIRECTION == "vertical" || boatSelected == 1) {
  	
  	if (y > 0 && playerBoardElements[x][y - 1] == ELEMENT_BOAT || boatSelected == 1) {
  	  if (y < GRID_SQUARES - 1) {
  	    drawMiss(true, x, y + 1);
  	  }
  	  if (y - boatSelected >= 0) {
  	  	drawMiss(true, x, y - boatSelected);
  	  }
  	}
  	
  	else if (y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_BOAT || boatSelected == 1) {
  	  if (y > 0) {
  	  	drawMiss(true, x, y - 1);
  	  }
  	  if (y + boatSelected < GRID_SQUARES) {
  	  	drawMiss(true, x, y + boatSelected);
  	  }
  	} 
  }	
}

var isNextPart = function(x, y) {
  if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_BOAT ||
  	x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_BOAT ||
  	y > 0 && playerBoardElements[x][y - 1] == ELEMENT_BOAT ||
  	y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_BOAT) {
  	
  	return true;
  	}
  else {
  	return false;
  }
}

var getDirection = function(x, y) {
	if (x > 0 && playerBoardElements[x - 1][y] == ELEMENT_BOAT ||
  		x < GRID_SQUARES - 1 && playerBoardElements[x + 1][y] == ELEMENT_BOAT) {
  			
  	  return "horizontal";
  	}
  	
  	else if (y > 0 && playerBoardElements[x][y - 1] == ELEMENT_BOAT ||
  			y < GRID_SQUARES - 1 && playerBoardElements[x][y + 1] == ELEMENT_BOAT) {
  				
  	  return "vertical";
  	}
}

// -----------------------
// Player input handling
// -----------------------

var handlePlayerCanvasClick = function(x, y) {
  
  if (playerBoardElements[x][y] != null) {
    return;
  }
  if (boatSelected == 0) {
  	return;
  }
  if (drawnParts == 0 || isNextPart(x, y) == true) {
	  drawBoat(true, x, y);
	  playerBoardElements[x][y] = ELEMENT_BOAT;
	  addForbiddenElements(x,y);
	  drawnParts += 1;
	  console.log("Drawn parts: " + drawnParts);
	  
	  if (drawnParts == 2) {
	  	DIRECTION = getDirection(x, y);
	  }
	  if (drawnParts == boatSelected) {
	  	addForbiddenEnds(x, y, boatSelected);
	  	boatSelected = 0;
	  	drawnParts = 0;
	  	console.log("Boat selected: " + boatSelected);
	  }
  }
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
  if (x < 0 || x > GRID_SQUARES - 1 || y < 0 || y > GRID_SQUARES - 1) {
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
