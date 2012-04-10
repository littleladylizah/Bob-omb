// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

import java.util.Random;

import ee.ut.cs.vl.bobomb.util.Coordinates;

public class Game {

    private State state = State.CREATED;
    private Player player1;
    private Player player2;
    private Grid p1Grid;
    private Grid p2Grid;
    private boolean turn; // true: player1, false: player 2
    private Coordinates lastMove;

    public Game(Player player) {
        this.player1 = player;
    }

    public void addOpponent(Player player) {
        this.player2 = player;
        this.state = State.PREPARING;
        this.turn = new Random().nextBoolean();
    }

    public boolean addGrid(boolean forP1, Grid grid) {
        if (forP1) {
            p1Grid = grid;
        } else {
            p2Grid = grid;
        }

        if ((forP1 ? p2Grid : p1Grid) != null) {
            state = State.STARTED;
            return true;
        } else {
            return false;
        }
    }

    public boolean bomb(boolean player1, Coordinates coords) {
        lastMove = coords;
        Grid grid = player1 ? p1Grid : p2Grid;
        boolean res = grid.bomb(coords.x, coords.y);
        if (grid.allBoatsHit()) {
            state = State.FINISHED;
        }
        if (!res) {
            turn = !turn;
        }
        return res;
    }

    public boolean isStarted() {
        return State.STARTED == state;
    }

    public boolean isFinished() {
        return State.FINISHED == state;
    }

    public Player getPlayer1() {
        return player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public boolean isPlayer1Turn() {
        return turn;
    }

    public Coordinates getLastMove() {
        return lastMove;
    }

    public boolean isGridDefined(boolean forP1) {
        if (forP1) {
            return p1Grid != null;
        }
        return p2Grid != null;
    }

    private static enum State {
        CREATED,
        PREPARING,
        STARTED,
        FINISHED
    }

}
