import com.sun.corba.se.spi.orbutil.fsm.InputImpl;

import java.io.*;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static java.nio.file.StandardCopyOption.*;

/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryCollector implements Collector {

    @Override
    public Object getData() {
        return null;
    }

    @Override
    public String getKey() {
        return null;
    }

    @Override
    public void collectData() {
        Connection connection = null;
        ResultSet resultSet = null;
        Statement statement = null;
        ProcessBuilder pb = new ProcessBuilder("./scripts/chromeDbCp.sh");
        try {
            Process copyProcess = pb.start();
            copyProcess.waitFor();
            Class.forName ("org.sqlite.JDBC");
            connection = DriverManager
                    .getConnection("jdbc:sqlite:/home/ayme/repos/Addigy3/AdgCollector/logs/history.tmp");
            statement = connection.createStatement ();
            resultSet = statement
                    .executeQuery ("SELECT * FROM urls order by last_visit_time desc limit 10");
            while (resultSet.next ()) {
                System.out.println ("URL [" + resultSet.getString ("url") + "]" +
                        ", visit count [" + resultSet.getString ("visit_count") + "]");
            }
        }
        catch (Exception e) {
            e.printStackTrace ();
        }
        finally {
            try {
                resultSet.close ();
                statement.close ();
                connection.close ();
            }
            catch (Exception e) {
                e.printStackTrace ();
            }
        }
    }

    @Override
    public void hasUploaded() {

    }
}
