// vim: set sw=4 ts=4 et:
package ee.ut.cs.vl.bobomb.model;

import ee.ut.cs.vl.bobomb.util.Coordinates;

public class Grid {

    public static final int SIZE = 10;

    private Square[][] grid = new Square[SIZE][SIZE];

    {
        for (int x = 0; x < SIZE; x++) {
            for (int y = 0; y < SIZE; y++) {
                grid[x][y] = Square.EMPTY;
            }
        }
    }

    public Grid(Coordinates[] coords) {
        for (Coordinates c : coords) {
            validateCoordinates(c.x , c.y);
            grid[c.x][c.y] = Square.BOAT;
        }
    }

    public boolean canBomb(int x, int y) {
        return Square.EMPTY == grid[x][y]
                || Square.BOAT == grid[x][y];
    }

    public String bomb(int x, int y) {
        validateCoordinates(x, y);
        switch (grid[x][y]) {
        case EMPTY:
            grid[x][y] = Square.MISSED;
            return "false";

        case BOAT:
            grid[x][y] = Square.HIT_BOAT;
            for (int i = x + 1; i < SIZE; i++) {
                if (grid[i][y] == Square.BOAT) {
                    return "true";
                }
                if (grid[i][y] == Square.MISS) {
                    break;
                }
            }
             for (int i = x - 1; i >= 0; i--) {
                if (grid[i][y] == Square.BOAT) {
                    return "true";
                }
                if (grid[i][y] == Square.MISS) {
                    break;
                } 
            }
             for (int i = y + 1; i < SIZE; i++) {
                 if (grid[x][i] == Square.BOAT) {
                     return "true";
                 }
                 if (grid[x][i] == Square.MISS) {
                     break;
                 }
             }
              for (int i = y - 1; i >= 0; i--) {
                 if (grid[x][i] == Square.BOAT) {
                     return "true";
                 }
                 if (grid[x][i] == Square.MISS) {
                     break;
                 } 
             }
            return "sunken";

        default:
            throw new IllegalArgumentException("Ruutu (" + x + ", " + y
                    + ") on juba pommitatud");
        }
    }

    private void validateCoordinates(int x, int y) {
        if (!isOnGrid(x, y)) {
            throw new IllegalArgumentException("Koordinaadid (" + x + ", " + y
                    + ") on väljaspool mängulauda");
        }
    }

    public static boolean isOnGrid(int x, int y) {
        return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
    }
    
    public boolean allBoatsHit() {
    	for (int i = 0; i < SIZE; i++) {
    		for (int j = 0; j < SIZE; j++) {
    			if (grid[i][j] == Square.BOAT) {
    				return false;
    			}
    		}
    	}
    	return true;
    }

    private static enum Square {
        EMPTY,
        MISSED,
        BOAT,
        HIT_BOAT
    }

}
