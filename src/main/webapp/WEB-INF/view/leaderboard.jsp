<%@page pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="leaderboard">
<h3>Edetabel</h3>
  <c:choose>
    <c:when test="${empty players}">
      Edetabel on hetkel tühi. Ole esimene võitja!
    </c:when>
    <c:otherwise>
      <ol>
        <c:forEach var="player" items="${players}">
          <li>${player.name}<span>${player.gamesWon}:${player.gamesLost}, ${player.winPercentage}</span></li>
        </c:forEach>
      </ol>
    </c:otherwise>
  </c:choose>
</div>
