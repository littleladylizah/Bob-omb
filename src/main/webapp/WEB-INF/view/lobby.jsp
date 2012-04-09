<%@page pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<div class="lobby">
  <h3>Vali vastane:</h3>
  <c:choose>
    <c:when test="${waiting == null}">
      Ühtegi vastast pole.
    </c:when>
    <c:otherwise>
      <ul>
        <c:forEach var="opponent" items="${waiting}">
          <li>${opponent.name}</li>
        </c:forEach>
      </ul>
    </c:otherwise>
  </c:choose>

  <h3>Käimasolevad mängud:</h3>
  <c:choose>
    <c:when test="${ongoing == null}">
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
  
  <a id="new-game" href="#">Loo oma mäng</a>
  <script type="text/javascript" src="js/overlay.js"></script>
</div>
