<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="leaderboard">
<h3>Edetabel</h3>
<ol>
  <c:forEach var="player" items="${players}">
    <li>${player.name}<span>${player.gamesWon}:${player.gamesLost}</span></li>
  </c:forEach>
</ol>
</div>
