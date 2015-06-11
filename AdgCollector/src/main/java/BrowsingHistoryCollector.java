import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryCollector implements Collector {
    public static final String BROWSING_LAST_COLLECTED_DATE = "./logs/browsingLastCollectedDate";
    public static final String BROWSING_HISTORY_PATH = "./logs/BrowsingHistoryLog";
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
            long lastCollected =getLastCollectedTime();
            String query = "SELECT urls.url, urls.title, urls.visit_count, " +
                    "urls.last_visit_time, visits.visit_time FROM urls, visits " +
                    "WHERE urls.id = visits.url AND visits.visit_time >" +lastCollected +
                    " order by visits.visit_time desc limit 10";
            connection = DriverManager.getConnection("jdbc:sqlite:/home/ayme/repos/Addigy3/AdgCollector/logs/history.tmp");
            statement = connection.createStatement ();
            resultSet = statement.executeQuery(query);
            BrowsingHistoryParser parser = new BrowsingHistoryParser(System.getProperty("user.name"),resultSet);
            while (parser.hasNextEntry()) {
                UrlEntry currEntry = parser.getNextEntry();
                urls.add(currEntry);
                System.out.println(currEntry.toString());
            }
            addEntriesToCachedFile(urls);
            saveLastCollectedTime();
        }
        catch (Exception e) {
            e.printStackTrace ();
        }
        finally {
            try {
                statement.close ();
                connection.close ();
            } catch (Exception e) {
                e.printStackTrace ();
            }
        }
    }

    @Override
    public void hasUploaded() {
        try {
            new FileWriter(BROWSING_HISTORY_PATH);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private void saveLastCollectedTime(){
        try {
            FileWriter writer = new FileWriter(BROWSING_LAST_COLLECTED_DATE);
            Date now = new Date();
            writer.write(String.valueOf(now.getTime()));
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private long getLastCollectedTime() throws IOException {
        File file = new File(BROWSING_LAST_COLLECTED_DATE);
        if(!file.exists())
            return 0;
        BufferedReader reader = new BufferedReader(new FileReader(BROWSING_LAST_COLLECTED_DATE));
        long lastDateTimestamp = Long.parseLong(reader.readLine());
        long toAdd=11644473600000L;
        return (lastDateTimestamp+toAdd)*1000;
    }
    private void copyBrowsingDatabase() throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("./scripts/chromeDbCp.sh");
        Process copyProcess = pb.start();
        copyProcess.waitFor();
    }
    private void addEntriesToCachedFile(List<UrlEntry> entries) throws IOException {
        File file =new File(BROWSING_HISTORY_PATH);
        if(!file.exists()){
            file.createNewFile();
        }
        try{
            FileWriter writer = new FileWriter(BROWSING_HISTORY_PATH,true);
            for(int i=entries.size()-1; i>=0; i--)
                writer.write(entries.get(i).toString()+"\n");
            writer.close();
        }
        catch (Exception e){
            System.out.println(e.getStackTrace());
        }
    }
}
