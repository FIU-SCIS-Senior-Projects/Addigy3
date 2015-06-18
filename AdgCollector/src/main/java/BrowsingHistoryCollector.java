import java.io.*;
import java.sql.*;
import java.util.*;
import java.util.Date;


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
        List<String> users = getUsersList();
        for(String user:users){
            Connection connection = null;
            ResultSet resultSet;
            Statement statement = null;
            List<UrlEntry> urls = new ArrayList<>();
            try {
                copyBrowsingDatabase(user);
                Class.forName ("org.sqlite.JDBC");
                String query = getChromeQuery();
                connection = DriverManager.getConnection("jdbc:sqlite:/home/ayme/repos/Addigy3/AdgCollector/logs/history.tmp");
                statement = connection.createStatement ();
                resultSet = statement.executeQuery(query);
                BrowsingHistoryParser parser = new BrowsingHistoryParser(user,resultSet);
                while (parser.hasNextEntry()) {
                    UrlEntry currEntry = parser.getNextChromeEntry();
                    urls.add(currEntry);
                    System.out.println(currEntry.toString());
                }
                query = getFirefoxQuery();
                connection = DriverManager.getConnection("jdbc:sqlite:/home/ayme/repos/Addigy3/AdgCollector/logs/mozilla_history.tmp");
                statement = connection.createStatement ();
                resultSet = statement.executeQuery(query);
                parser = new BrowsingHistoryParser(System.getProperty("user.name"),resultSet);
                while (parser.hasNextEntry()) {
                    UrlEntry currEntry = parser.getNextFireFoxEntry();
                    urls.add(currEntry);
                    System.out.println(currEntry.toString());
                }
                addEntriesToCachedFile(urls);
                saveLastCollectedTime();
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
        try {
            new FileWriter(BROWSING_HISTORY_PATH);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private List<String> getUsersList (){
        Set<String> users = new HashSet<>();
        String line="";
        try {
            Process process = Runtime.getRuntime().exec("users");
            InputStream input = process.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
            line=reader.readLine();
            if(line!=null){
                String tokens[] = line.split("\\s+");
                for(String token:tokens) {
                    users.add(token);
                }
            }
            List<String> allUsers = new ArrayList<>();
            allUsers.addAll(users);
            return allUsers;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    private String getUserPath(String username) throws IOException, InterruptedException {
        String grepCmd="grep " + username + " /etc/passwd | cut -d \":\" -f6";
        String[] cmd = {"/bin/sh", "-c", grepCmd};
        Process process = Runtime.getRuntime().exec(cmd);
        process.waitFor();
        InputStream input = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        String line=reader.readLine();
        return line;
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
        return Long.parseLong(reader.readLine());
    }
    private long getChromeFormatDate(long date){
        long toAdd=11644473600000L;
        return (date+toAdd)*1000;
    }
    private void copyBrowsingDatabase(String user) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("./scripts/chromeDbCp.sh", getUserPath(user));
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
    private String getChromeQuery() throws IOException {
        long lastCollected=getLastCollectedTime();
        long lastDateInChromeFormat = getChromeFormatDate(lastCollected);
        String query = "SELECT urls.url, urls.title, urls.visit_count, " +
                "urls.last_visit_time, visits.visit_time FROM urls, visits " +
                "WHERE urls.id = visits.url AND visits.visit_time >" +lastDateInChromeFormat +
                " order by visits.visit_time desc limit 10";
        return query;
    }
    private String getFirefoxQuery() throws IOException {
        long lastCollected =getLastCollectedTime()*1000;
        String query = "SELECT moz_places.url, moz_historyvisits.visit_date " +
                "FROM moz_places, moz_historyvisits " +
                "WHERE moz_places.id = moz_historyvisits.place_id " +
                "AND moz_historyvisits.visit_date>" +lastCollected +
                " order by moz_historyvisits.visit_date desc limit 10";
        return query;
    }
}
