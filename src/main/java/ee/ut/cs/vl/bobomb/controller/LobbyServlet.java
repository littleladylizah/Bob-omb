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

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.setAttribute("waiting", openGames.values());
        req.setAttribute("ongoing", ongoingGames.values());
        req.getRequestDispatcher("/WEB-INF/view/lobby.jsp")
                .forward(req, resp);
    }

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
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
        Game game = new Game(new Player(name));

        openGames.put(name, game);
        req.getSession().setAttribute("game", game);

        /* block until we have opponent */
        while (true) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                break;
            }

            synchronized (game) {
                if (game.getPlayer2() != null) {
                    break;
                }
            }
        }

        resp.getWriter().print(game.getPlayer2().getName());
    }

    private void joinGame(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String name = req.getParameter("name");
        String opponent = req.getParameter("opponent");
        Game game = openGames.get(opponent);

        synchronized (game) {
            game.addOpponent(new Player(name));
        }
        req.getSession().setAttribute("game", game);

        openGames.remove(opponent);
        ongoingGames.put(opponent, game);

        resp.getWriter().print(game.getPlayer1().getName());
    }

    void gameDone(Game game) {
        ongoingGames.remove(game.getPlayer1().getName());
    }

}
