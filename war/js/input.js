// Handle clicks on the canvases

var myBoardElements = new Array(10);
var enemyBoardElements = new Array(10);

for (i=0; i<10; i++) {
	myBoardElements[i] = new Array(10);
	enemyBoardElements[i] = new Array(10);
	enemyBoardElements[i][i] = "boat";
}

/* http://stackoverflow.com/a/5417934 */
var getMousePosition = function(e) {
  var canoff = $(e.target).offset();
  var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoff.left);
  var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoff.top) + 1;

  return [x, y];
};

var handlePlayerCanvasClick = function(x, y) {
	
  if (myBoardElements[x][y] == "forbidden") {
  	return;
  } 
  
  drawBoat(true, x, y);
  myBoardElements[x][y] = "boat";
  addForbiddenElements(x,y);
    
}

var handleEnemyCanvasClick = function(x, y) {
  
  if (enemyBoardElements[x][y] == null) {
    drawMiss(false, x, y);
  }
  
  else {
  	drawHitBoat(false, x, y);
  } 
}

var handleCanvasClick = function(player, e) {
  var pos = getMousePosition(e);
  var x = Math.floor((pos[0] - (player ? gPlayerOffX : gEnemyOffX)) / gGridSize);
  var y = Math.floor((pos[1] - (player ? gPlayerOffY : gEnemyOffY)) / gGridSize);
  if (x < 0 || x > 9 || y < 0 || y > 9) {
    return;
  }
  if (player) {
    handlePlayerCanvasClick(x, y);
  } else {
    handleEnemyCanvasClick(x, y);
  }
}

var addForbiddenElements = function(x, y) {
  
  if (x>0 && y>0) {
    drawMiss(true, x-1, y-1);
    myBoardElements[x-1][y-1] = "forbidden";
  }
  
  if (x<9 && y>0) {
    drawMiss(true, x+1, y-1);
    myBoardElements[x+1][y-1] = "forbidden";
  }
  
  if (x>0 && y<9) {
    drawMiss(true, x-1, y+1);
    myBoardElements[x-1][y+1] = "forbidden";
  }
  
  if (x<9 && y<9) {
    drawMiss(true, x+1, y+1);
    myBoardElements[x+1][y+1] = "forbidden";
  }

}

$(window).load(function() {
  gPlayerCanvas.click(function(e) {
    handleCanvasClick(true, e);
  });
  gEnemyCanvas.click(function(e) {
    handleCanvasClick(false, e);
  });
});
