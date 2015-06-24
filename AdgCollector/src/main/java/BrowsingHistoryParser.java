
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryParser {
    private ResultSet queryResult;
    private String username;
    public BrowsingHistoryParser(String username, ResultSet queryResult){
        this.queryResult = queryResult;
        this.username = username;
    }
    public boolean hasNextEntry(){
        try {
            while (queryResult.next ()) {
                return true;
            }
            queryResult.close ();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    public UrlEntry getNextChromeEntry(){
        try {
            return new UrlEntry("Chrome",this.username, queryResult.getString("url"), queryResult.getString("visit_time"));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public UrlEntry getNextFireFoxEntry(){
        try {
            return new UrlEntry("Firefox",this.username, queryResult.getString("url"), queryResult.getString("visit_date"));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    public UrlEntry getNextSafariEntry(){
        try {
            return new UrlEntry("Safari",this.username, queryResult.getString("url"), queryResult.getString("visit_time"));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
