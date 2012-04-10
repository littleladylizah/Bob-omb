// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import ee.ut.cs.vl.bobomb.util.*;
import ee.ut.cs.vl.bobomb.model.*;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.ArrayList;

@WebServlet("/ajax/game")
public class GameServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;    

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("text/plain");
        resp.setCharacterEncoding("utf-8");

        String action = req.getParameter("action");
        if ("send_grid".equals(action)) {
        	String gridStr = req.getParameter("grid");
        	
        	try {
        	    Grid playerBoard = new Grid(Util.parseGrid(gridStr));
        	    Game game = (Game) req.getSession().getAttribute("game");
        	    boolean forP1 = (Boolean) req.getSession().getAttribute("player1");
                game.addGrid(forP1, playerBoard);
                waitOpponent(req, game, forP1);
                resp.getWriter().print(game.isPlayer1Turn() == forP1);
        	}
        	catch (java.text.ParseException e) {
        	    e.printStackTrace();
        	}
        }
    }
    
    private void waitOpponent(HttpServletRequest req, Game game, boolean forP1) {
        
        Player player = forP1 ? game.getPlayer1() : game.getPlayer2();
        Player opponent = forP1 ? game.getPlayer2() : game.getPlayer1();
        
        synchronized (opponent) {
            opponent.notify();
        }
        
        synchronized (player) {
            if (forP1) {
                while (!(game.isGridDefined(!forP1))) {
                    try {
                        player.wait();
                    } catch (InterruptedException e) {
                        return;
                    }
                }
            }
            else {
                while (!(game.isGridDefined(forP1))) {
                    try {
                        player.wait();
                    } catch (InterruptedException e) {
                        return;
                    }
                }    
            }
        }
    }
}
