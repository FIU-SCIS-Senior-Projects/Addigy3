
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
    public UrlEntry getNextEntry(){
        try {
            return new UrlEntry(this.username, queryResult.getString("url"), queryResult.getString("title"),
                    Long.parseLong(queryResult.getString("visit_count")),
                    queryResult.getString("last_visit_time"),
                    queryResult.getString("visit_time"));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
