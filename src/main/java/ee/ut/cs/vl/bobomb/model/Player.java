// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

public class Player {

    private String name;
    private long wins = 0;
    private long losses = 0;

    public Player(String name) {
        this.name = name;
    }

    public Player(String name, long wins, long losses) {
        this.name = name;
        this.wins = wins;
        this.losses = losses;
    }

    public long getWinPercentage() {
        return (100 * wins) / (wins + losses);
    }

    public long getGamesWon() {
        return wins;
    }

    public long getGamesLost() {
        return losses;
    }

    public String getName() {
        return name;
    }

}
