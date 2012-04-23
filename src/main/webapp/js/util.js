// --------------------------------
// Common functions and constants
// --------------------------------

var GRID_SQUARES = 10;

var isOutOfBounds = function(x, y) {
  return x < 0 || y < 0 || x >= GRID_SQUARES || y >= GRID_SQUARES;
};

// Retrieve an array of coordinates adjacent to (x, y)
var getAdjacent = function(x, y) {
  var arr = new Array();
  for (var i = x - 1; i <= x + 1; i++) {
    for (var j = y - 1; j <= y + 1; j++) {
      if (!(i == x && j == y) && !isOutOfBounds(i, j)) {
        arr.push([i, j]);
      }
    }
  }
  return arr;
};

// Retrieve an array of coordinates on the sides of (x, y)
var getSides = function(x, y) {
  return [[x - 1, y], [x, y - 1], [x + 1, y], [x, y + 1]].filter(function(coords) {
    return !isOutOfBounds(coords[0], coords[1]);
  });
};

// Retrieve an array of coordinates on the diagonals of (x, y)
var getDiagonals = function(x, y) {
  return [[x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]].filter(function(coords) {
    return !isOutOfBounds(coords[0], coords[1]);
  });
};

// Run fn(x, y) for every coordinate
var doForAll = function(fn) {
  for (x = 0; x < GRID_SQUARES; x++) {
    for (y = 0; y < GRID_SQUARES; y++) {
      fn(x, y);
    }
  }
};

// Run fn(x, y) for every valid square adjacent to (x, y)
var doForAdjacent = function(x, y, fn) {
  getAdjacent(x, y).forEach(function(coords) {
    fn(coords[0], coords[1]);
  });
};

// Run fn(x, y) for every valid square on the sides of (x, y)
var doForSides = function(x, y, fn) {
  getSides(x, y).forEach(function(coords) {
    fn(coords[0], coords[1]);
  });
};

// Run fn(x, y) for every valid square on the diagonals of (x, y)
var doForDiagonals = function(x, y, fn) {
  getDiagonals(x, y).forEach(function(coords) {
    fn(coords[0], coords[1]);
  });
};
