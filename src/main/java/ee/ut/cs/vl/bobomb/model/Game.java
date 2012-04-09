// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

import java.util.Random;

public class Game {

    private State state = State.CREATED;
    private Player player1;
    private Player player2;
    private Grid p1Grid;
    private Grid p2Grid;
    private boolean turn; // true: player1, false: player 2

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

    private static enum State {
        CREATED,
        PREPARING,
        STARTED,
        FINISHED
    }

}
