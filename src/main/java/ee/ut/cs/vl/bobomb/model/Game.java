// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

public class Game {

    private State state = State.CREATED;
    private Player player1;
    private Player player2;
    private Grid p1Grid;
    private Grid p2Grid;

    public Game(Player player) {
        this.player1 = player;
    }

    public void addOpponent(Player player) {
        this.player2 = player;
        this.state = State.PREPARING;
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
    
    public Player getBeginningPlayer() {
    	
    	Random generator = new Random();
    	if (generator.nextInt(2) == 0) {
    		return player1;
    	}
    	else {
    		return player2;
    	}
    }

    private static enum State {
        CREATED,
        PREPARING,
        STARTED,
        FINISHED
    }

}
