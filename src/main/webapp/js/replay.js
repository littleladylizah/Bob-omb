// ---------------------------------------
// Make sure we have Web Storage support
// ---------------------------------------

if (typeof(localStorage) == "undefined") {
  alert("Puudub HTML5 Web Storage tugi!");
};

// ------------------------------
// Basic accessors and mutators
// ------------------------------

var storeGet = function(key) {
  return JSON.parse(localStorage[key]);
};

var storePut = function(key, value) {
  localStorage[key] = JSON.stringify(value);
};

// ------------------------------
// Storing and retrieving games
// ------------------------------

var GAMES_KEY = "games";
var storageCallbacks = [];

var registerStorageCallback = function(handler) {
  storageCallbacks.push(handler);
};

var getGames = function() {
  return storeGet(GAMES_KEY);
};

var setGames = function(games) {
  storePut(GAMES_KEY, games);
  storageCallbacks.forEach(function(callback) {
    callback();
  });
};

var storeGame = function(game) {
  var games = getGames();
  games.push(game);
  setGames(games);
};

var getGame = function(index) {
  return getGames()[index];
};

var countGames = function() {
  return getGames().length;
};

// ------------------
// Replaying a game
// ------------------

var replayGame;
var replayIndex;
var replayID = -1;

var replay = function(game) {
  stopReplay();
  resetCanvases();
  drawInitialGrid(game.initial);
  replayGame = game;
  replayIndex = 0;
  startReplay();
};

var playNext = function() {
  if (replayGame == null || replayIndex >= replayGame.moves.length) {
    stopReplay();
    return;
  }
  var move = replayGame.moves[replayIndex++];
  if (move.hit) {
    drawHitBoat(move.player, move.x, move.y);
  } else {
    drawMiss(move.player, move.x, move.y);
  }
  if (move.sunk) {
    move.sunk.forEach(function(coords) {
      drawSunken(move.player, coords[0], coords[1]);
    });
  }
};

var playPrev = function() {
  if (replayGame == null || replayIndex <= 0) {
    return;
  }
  var move = replayGame.moves[--replayIndex];
  drawEmpty(move.player, move.x, move.y);
  if (move.hit) {
    if (move.player) {
      drawBoat(true, move.x, move.y, false, true);
    } else {
      doForSides(move.x, move.y, function(x, y) {
        if (hasDrawn(false, x, y)) {
          drawEmpty(false, x, y);
          drawHitBoat(false, x, y);
        }
      });
    }
    if (move.sunk) {
      move.sunk.forEach(function(coords) {
        if (coords[0] != move.x || coords[1] != move.y) {
          drawEmpty(move.player, coords[0], coords[1]);
          drawHitBoat(move.player, coords[0], coords[1]);
        }
      });
    }
  }
};

var startReplay = function() {
  if (replayGame != null && replayID == -1) {
    replayID = setInterval(playNext, 1000);
  }
};

var stopReplay = function() {
  clearInterval(replayID);
  replayID = -1;
};

// ------------------
// Recording a game
// ------------------

var recordNew = function(player, enemy, board) {
  var game = new Object();
  game.name = new Date().toLocaleDateString() + " " + player + " vs " + enemy;
  game.enemy = enemy;
  game.initial = $.extend(true, [], board); // deep copy
  game.moves = [];
  return game;
};

var recordMove = function(game, player, x, y, hit, sunk) {
  var move = new Object();
  move.player = player; // this shows whose board the move is on, not who made it
  move.x = x;
  move.y = y;
  move.hit = hit;
  move.sunk = sunk;
  game.moves.push(move);
};

// ----------------------------------------
// Make sure we have the GAMES_KEY object
// ----------------------------------------

$(window).load(function() {
  if (!storeGet(GAMES_KEY)) {
    storePut(GAMES_KEY, []);
  }
});
