// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ee.ut.cs.vl.bobomb.model.Game;
import ee.ut.cs.vl.bobomb.model.Player;

@WebServlet("/ajax/lobby")
public class LobbyServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    // Games mapped by player1's id
    private Map<String, Game> openGames = new HashMap<String, Game>();
    private Map<String, Game> ongoingGames = new HashMap<String, Game>();
    private Object lock = new Object();

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        synchronized (lock) {
            req.setAttribute("waiting", openGames.values());
            req.setAttribute("ongoing", ongoingGames.values());
        }
        req.getRequestDispatcher("/WEB-INF/view/lobby.jsp")
                .forward(req, resp);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("text/plain");
        resp.setCharacterEncoding("utf-8");

        Game current = (Game) req.getSession().getAttribute("game");
        if (current != null) {
            gameDone(current);
        }

        String action = req.getParameter("action");
        if ("create".equals(action)) {
            createGame(req, resp);
        } else if ("join".equals(action)) {
            joinGame(req, resp);
        }
    }

    private void createGame(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");
        Player player = new Player(name);
        Game game = new Game(player);
        req.getSession().setAttribute("player1", true);

        synchronized (lock) {
            openGames.put(name, game);
        }
        req.getSession().setAttribute("game", game);

        synchronized (player) {
            while (game.getPlayer2() == null) {
                try {
                    player.wait();
                } catch (InterruptedException e) {
                    return;
                }
            }
        }
        resp.getWriter().print(game.getPlayer2().getName());
    }

    private void joinGame(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");
        String opponent = req.getParameter("opponent");
        Game game;
        synchronized (lock) {
            game = openGames.get(opponent);
        }

        synchronized (game) {
            game.addOpponent(new Player(name));
        }
        req.getSession().setAttribute("player1", false);
        
        synchronized (game.getPlayer1()) {
            game.getPlayer1().notify();
        }
        req.getSession().setAttribute("game", game);

        synchronized (lock) {
            openGames.remove(opponent);
            ongoingGames.put(opponent, game);
        }

        resp.getWriter().print(game.getPlayer1().getName());
    }

    void gameDone(Game game) {
        synchronized (lock) {
            ongoingGames.remove(game.getPlayer1().getName());
        }
    }

}
