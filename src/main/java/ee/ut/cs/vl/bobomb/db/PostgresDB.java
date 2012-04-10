// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import ee.ut.cs.vl.bobomb.model.Game;
import ee.ut.cs.vl.bobomb.model.Player;

public class PostgresDB {

    private static final String username = "bobomb", password = "bobomb";
    private static final String URL =
            "jdbc:postgresql://postgres-bobomb.jelastic.dogado.eu/bobomb";

    private static Connection createConnection() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(URL, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    public static List<Player> getLeaderboard() {
        List<Player> res = new ArrayList<Player>();
        Statement s = null;
        try {
            Connection conn = createConnection();
            if (conn == null) {
                return Collections.emptyList();
            }

            s = conn.createStatement();
            ResultSet rs =  s.executeQuery(
                    "select "
                    + "    coalesce(w.player, l.player), "
                    + "    coalesce(w.wins, 0) as rank, "
                    + "    coalesce(l.losses, 0) "
                    + "from "
                    + "    (select winner as player, count(winner) as wins "
                    + "        from game group by winner) w "
                    + "full join "
                    + "    (select loser as player, count(loser) as losses "
                    + "        from game group by loser) l "
                    + "on w.player = l.player "
                    + "order by rank desc "
                    + "limit 10");
            while (rs.next()) {
                String name = rs.getString(1);
                long wins = rs.getLong(2);
                long losses = rs.getLong(3);
                res.add(new Player(name, wins, losses));
            }
            s.close();
            return res;
        } catch (SQLException e) {
            e.printStackTrace();
            return Collections.emptyList();
        } finally {
            if (s != null) {
                try { s.close(); } catch (Exception e) {}
            }
        }
    }

    public void saveGame(Game game) {
        PreparedStatement ps = null;
        try {
            ps = createConnection().prepareStatement(
                    "insert into game (winner, loser) values (?, ?)");
            ps.setString(1, game.getPlayer1().getName());
            ps.setString(2, game.getPlayer2().getName());
            ps.execute();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (ps != null) {
                try { ps.close(); } catch (Exception e) {}
            }
        }
    }

}
