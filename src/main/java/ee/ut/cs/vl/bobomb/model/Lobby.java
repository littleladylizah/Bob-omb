// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Lobby {

    private static Lobby instance = new Lobby();

    // Games mapped by player1's id
    private Map<String, Game> openGames = new HashMap<String, Game>();
    private Map<String, Game> ongoingGames = new HashMap<String, Game>();
    private Object lock = new Object();

    public void createGame(Game game) {
        synchronized (lock) {
            openGames.put(game.getPlayer1().getName(), game);
        }
    }

    public Game getOpenGame(String player) {
        synchronized (lock) {
            return openGames.get(player);
        }
    }

    public void startGame(Game game) {
        String name = game.getPlayer1().getName();
        synchronized (lock) {
            openGames.remove(name);
            ongoingGames.put(name, game);
        }
    }

    public void gameDone(Game game) {
        synchronized (lock) {
            ongoingGames.remove(game.getPlayer1().getName());
        }
    }

    public Collection<Game> getOpenGames() {
        synchronized (lock) {
            return openGames.values();
        }
    }

    public Collection<Game> getOngoingGames() {
        synchronized (lock) {
            return ongoingGames.values();
        }
    }

    public static Lobby getInstance() {
        return instance;
    }

}
