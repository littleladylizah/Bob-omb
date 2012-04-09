// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        List<Player> tmp = new ArrayList<Player>();
        tmp.add(new Player("Liis"));
        tmp.add(new Player("Tiit"));
        tmp.add(new Player("Thor"));

        List<Game> tmp2 = new ArrayList<Game>();
        Game game = new Game(new Player("Lauri"));
        game.addOpponent(new Player("Ivo"));
        tmp2.add(game);

        req.setAttribute("waiting", tmp);
        req.setAttribute("ongoing", tmp2);
        req.getRequestDispatcher("/WEB-INF/view/lobby.jsp")
                .forward(req, resp);
    }

}
