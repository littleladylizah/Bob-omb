// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.controller;

import ee.ut.cs.vl.bobomb.util.*;

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

        if ("send_grid".equals(action)) {
        	String gridStr = req.getParameter("grid");
        	Grid playerBoard = new Grid(Util.parseGrid(gridStr));
            Game game = req.getSession().getAttribute("game");
            game.addGrid(true, playerBoard);
        }

}
