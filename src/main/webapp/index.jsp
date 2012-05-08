<%@page pageEncoding="utf-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
  "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <script type="text/javascript" src="js/jquery.tools.min.js"></script>
    <script type="text/javascript" src="js/util.js"></script>
    <script type="text/javascript" src="js/canvas.js"></script>
    <script type="text/javascript" src="js/audio.js"></script>
    <script type="text/javascript" src="js/replay.js"></script>
    <script type="text/javascript" src="js/game.js"></script>
    <script type="text/javascript" src="js/ui/common.js"></script>
    <script type="text/javascript" src="js/ui/sidebar.js"></script>
    <script type="text/javascript" src="js/ui/overlay.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <link rel="stylesheet" type="text/css" href="css/sidebar.css"/>
    <link rel="stylesheet" type="text/css" href="css/overlay.css"/>
    <title>Bob-omb Battleships</title>
    
    
    	<audio id="audio-boom" src="audio/boom.wav" type="audio/wav" preload="auto"></audio>
    	<audio id="audio-hit" src="audio/hit.wav" type="audio/wav" preload="auto"></audio>
    	<audio id="audio-loss" src="audio/loss.wav" type="audio/wav" preload="auto"></audio>
    	<audio id="audio-miss" src="audio/miss.wav" type="audio/wav" preload="auto"></audio>
    	<audio id="audio-win" src="audio/win.wav" type="audio/wav" preload="auto"></audio>
    
  </head>
  <body>
    <div id="center">
    	
      <div id="result"></div>
      <div id="fuzz"></div>
      
      <h1>Bob-omb</h1>
      <h2 id="player-title">${player_name}</h2>
      <h2 id="enemy-title">Vastase mängulaud</h2>
      <div class="clearfix"></div>
      <canvas id="player-canvas" width="420" height="420"></canvas>
      <canvas id="enemy-canvas" width="420" height="420"></canvas>
      <div class="clearfix"></div>
      <a id="lobby-link" href="ajax/lobby" rel="#overlay">Alusta uut mängu</a>
    </div>

    <!-- the sidebar -->
    <div id="sidebar">
      <div id="sidebar-toggle"></div>
      <div id="sidebar-container" class="sidebar-on">
        <a id="sidebar-games" class="right faded" href="#">Mängud</a>
        <div class="clearfix"></div>
        <div id="sidebar-content">
          <div id="sidebar-boats">
            <p id="boat4">
              <img src="img/boat-left.png" /><img src="img/boat-middle-horizontal.png" /><img src="img/boat-middle-horizontal.png" /><img src="img/boat-right.png" /> x <span id="boat4-left">1</span>
            </p>
            <p id="boat3">
              <img src="img/boat-left.png" /><img src="img/boat-middle-horizontal.png" /><img src="img/boat-right.png" /> x <span id="boat3-left">2</span>
            </p>
            <p id="boat2">
              <img src="img/boat-left.png" /><img src="img/boat-right.png" /> x <span id="boat2-left">3</span>
            </p>
            <p id="boat1">
              <img src="img/boat-single.png" /> x <span id="boat1-left">4</span>
            </p>
            <p id="delete-boats" class="button">Kustuta laev</p>
            <p id="confirm-boats" class="button">Kinnita paigutus</p>
          </div>
          <div id="sidebar-replay" class="hidden">
            <div id="replay-buttons">
              <img id="replay-prev" src="img/prev.png" />
              <img id="replay-play" src="img/play.png" />
              <img id="replay-next" src="img/next.png" />
            </div>
            <ul></ul> <!-- dynamically filled -->
          </div>
        </div>
        <a id="leaderboard-link" class="right" href="ajax/leaderboard" rel="#overlay">Edetabel</a>
      </div>
    </div>

    <!-- the overlayed element -->
    <div id="overlay">
      <!-- the external content is loaded inside this tag -->
      <div id="content-wrap"></div>
    </div>
  </body>
</html>
