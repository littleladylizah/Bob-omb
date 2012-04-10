// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.util;

import java.text.ParseException;

public class Util {

    /** Loeb sõnest kujul "00 01 02 .." välja kõik koordinaadid ning tagastab
     * need objektidena. */
    public static Coordinates[] parseGrid(String gridString)
            throws ParseException {
        if (gridString == null || gridString.trim().isEmpty()) {
            return null;
        }

        String[] tokens = gridString.split(" ");
        Coordinates[] res = new Coordinates[tokens.length];
        for (int i = 0; i < tokens.length; i++) {
            String token = tokens[i];
            if (!token.matches("^\\d{2}$")) {
                throw new ParseException("Vigane koordinaat " + token, i);
            }
            res[i] = parseCoordinates(token);
        }
        return res;
    }

    public static Coordinates parseCoordinates(String coords) {
        int x = Integer.valueOf(coords.substring(0, 1));
        int y = Integer.valueOf(coords.substring(1, 2));
        return new Coordinates(x, y);
    }

}
