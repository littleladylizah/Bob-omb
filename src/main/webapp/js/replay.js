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
  replayGame = game;
  replayIndex = 0;
  startReplay();
};

var playNext = function() {
  if (replayIndex >= replayGame.moves.length) {
    stopReplay();
    return;
  }
  // TODO
  replayIndex++;
};

var playPrev = function() {
  if (replayIndex <= 0) {
    return;
  }
  replayIndex--;
  // TODO
};

var startReplay = function() {
  replayID = setInterval(playNext, 1000);
};

var stopReplay = function() {
  clearInterval(replayID);
};

// ----------------------------------------
// Make sure we have the GAMES_KEY object
// ----------------------------------------

$(window).load(function() {
  if (!storeGet(GAMES_KEY)) {
    storePut(GAMES_KEY, []);
  }
});
