import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryCollector implements Collector {
    public static final String LOGIN_BROWSING_PATH = "./logs/BrowsingHistoryLog";
    @Override
    public Object getData() {
        try {
            return new BrowsingHistoryCachedParser().getUploadData();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String getKey() {
        return "browsingHistory";
    }

    @Override
    public void collectData() {
        Connection connection = null;
        ResultSet resultSet;
        Statement statement = null;
        List<UrlEntry> urls = new ArrayList<>();
        try {
            copyBrowsingDatabase();
            Class.forName ("org.sqlite.JDBC");
            connection = DriverManager.getConnection("jdbc:sqlite:/home/ayme/repos/Addigy3/AdgCollector/logs/history.tmp");
            statement = connection.createStatement ();
            resultSet = statement.executeQuery("SELECT urls.url, urls.title, urls.visit_count, " +
                    "urls.last_visit_time, visits.visit_time FROM urls, visits " +
                    "WHERE urls.id = visits.url " +
                    "order by visits.visit_time desc limit 10");
            BrowsingHistoryParser parser = new BrowsingHistoryParser(System.getProperty("user.name"),resultSet);
            while (parser.hasNextEntry()) {
                UrlEntry currEntry = parser.getNextEntry();
                urls.add(currEntry);
                System.out.println(currEntry.toString());
            }
            addEntriesToCachedFile(urls);
        }
        catch (Exception e) {
            e.printStackTrace ();
        }
        finally {
            try {
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

    private void copyBrowsingDatabase() throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("./scripts/chromeDbCp.sh");
        Process copyProcess = pb.start();
        copyProcess.waitFor();
    }
    private void addEntriesToCachedFile(List<UrlEntry> entries){
        try{
            FileWriter writer = new FileWriter(LOGIN_BROWSING_PATH);
            for(int i=entries.size()-1; i>=0; i--)
                writer.write(entries.get(i).toString()+"\n");
            writer.close();
        }
        catch (Exception e){
            System.out.println(e.getStackTrace());
        }
    }
}
