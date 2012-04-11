// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import ee.ut.cs.vl.bobomb.db.PostgresDB;
import ee.ut.cs.vl.bobomb.model.Game;
import ee.ut.cs.vl.bobomb.model.Grid;
import ee.ut.cs.vl.bobomb.model.Player;
import ee.ut.cs.vl.bobomb.util.Coordinates;
import ee.ut.cs.vl.bobomb.util.Util;

@WebServlet("/ajax/game")
public class GameServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("text/plain");
        resp.setCharacterEncoding("utf-8");

        Game game = (Game) req.getSession().getAttribute("game");
        if (game == null || game.isFinished()) {
            resp.sendError(HttpServletResponse.SC_CONFLICT);
            return;
        }

        String action = req.getParameter("action");
        if ("send_grid".equals(action)) {
            addGrid(req, resp);
        } else if ("enemyMove".equals(action)) {
            enemyMove(req, resp);
        } else if ("bomb".equals(action)) {
            bomb(req, resp);
        }
    }

    private void addGrid(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        String gridStr = req.getParameter("grid");
        Grid playerBoard;
        try {
            playerBoard = new Grid(Util.parseGrid(gridStr));
        }
        catch (java.text.ParseException e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        Game game = (Game) req.getSession().getAttribute("game");
        boolean forP1 = (Boolean) req.getSession().getAttribute("player1");

        synchronized (game) {
            game.addGrid(forP1, playerBoard);
        }
        waitOpponent(game, forP1);
        resp.getWriter().print(game.isPlayer1Turn() == forP1);
    }

    private void waitOpponent(Game game, boolean isPlayer1) {
        Player player = isPlayer1 ? game.getPlayer1() : game.getPlayer2();
        Player opponent = isPlayer1 ? game.getPlayer2() : game.getPlayer1();

        synchronized (opponent) {
            opponent.notify();
        }

        synchronized (player) {
            while (!game.isGridDefined(!isPlayer1)) {
                try {
                    player.wait();
                } catch (InterruptedException e) {
                    return;
                }
            }
        }
    }

    private void enemyMove(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        HttpSession sess = req.getSession();
        Game game = (Game) sess.getAttribute("game");
        Boolean player1 = (Boolean) sess.getAttribute("player1");
        Player player = player1 ? game.getPlayer1() : game.getPlayer2();

        synchronized (player) {
            while (game.isPlayer1Turn() != player1) {
                try {
                    player.wait();
                } catch (InterruptedException e) {
                    return;
                }
            }
        }
        resp.getWriter().print(game.getLastMove()
                + (game.isFinished() ? ";false" : ";null"));
    }

    private void bomb(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        HttpSession sess = req.getSession();
        Game game = (Game) sess.getAttribute("game");
        Boolean player1 = (Boolean) sess.getAttribute("player1");
        Coordinates coords = Util.parseCoordinates(req.getParameter("square"));

        String hit; 
        boolean finished;
        synchronized (game) {
            hit = game.bomb(!player1, coords);
            finished = game.isFinished();
        }

        Player enemy = player1 ? game.getPlayer2() : game.getPlayer1();
        synchronized (enemy) {
            enemy.notify();
        }

        if (finished) {
            PostgresDB.saveGame(game);
            ((LobbyServlet) sess.getAttribute("lobbyServlet")).gameDone(game);
        }
        resp.getWriter().print(hit + (finished ? ";true" : ";null"));
    }

}
