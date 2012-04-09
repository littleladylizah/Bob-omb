<%@page pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="lobby">
  <h3>Vali vastane:</h3>
  <c:choose>
    <c:when test="${empty waiting}">
      Ühtegi vastast pole.
    </c:when>
    <c:otherwise>
      <ul>
        <c:forEach var="game" items="${waiting}">
          <li class="opponent-link">${game.player1.name}</li>
        </c:forEach>
      </ul>
    </c:otherwise>
  </c:choose>

  <h3>Käimasolevad mängud:</h3>
  <c:choose>
    <c:when test="${empty ongoing}">
      Ühtegi mängu pole.
    </c:when>
    <c:otherwise>
      <ul>
        <c:forEach var="game" items="${ongoing}">
          <li>${game.player1.name} vs. ${game.player2.name}</li>
        </c:forEach>
      </ul>
    </c:otherwise>
  </c:choose>
  
  <p id="new-game">Loo oma mäng</p>
  <script type="text/javascript" src="js/ui/overlay.js"></script>
</div>
