import java.io.*;
import java.sql.*;
import java.util.*;
import java.util.Date;


/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryCollector implements Collector {
    public static final String PROJECT_DIRECTORY = System.getProperty("user.home") + "/addigy/";
    public static final String BROWSING_LAST_COLLECTED_DATE = PROJECT_DIRECTORY + "logs/browsingLastCollectedDate";
    public static final String BROWSING_HISTORY_PATH = PROJECT_DIRECTORY + "logs/BrowsingHistoryLog";
    public static final String CHROME_DB_COPY = PROJECT_DIRECTORY + "logs/chrome_db.tmp";
    public static final String FIREFOX_DB_COPY = PROJECT_DIRECTORY + "logs/firefox_db.tmp";
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
                copyBrowsingDatabases(getUserPath(user));
                Class.forName ("org.sqlite.JDBC");
                String query = getChromeQuery();
                connection = DriverManager.getConnection("jdbc:sqlite:"+ CHROME_DB_COPY);
                statement = connection.createStatement();
                resultSet = statement.executeQuery(query);
                BrowsingHistoryParser parser = new BrowsingHistoryParser(user,resultSet);
                while (parser.hasNextEntry()) {
                    UrlEntry currEntry = parser.getNextChromeEntry();
                    urls.add(currEntry);
                    System.out.println(currEntry.toString());
                }
                query = getFirefoxQuery();
                connection = DriverManager.getConnection("jdbc:sqlite:"+ FIREFOX_DB_COPY);
                statement = connection.createStatement();
                resultSet = statement.executeQuery(query);
                parser = new BrowsingHistoryParser(user,resultSet);
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
        CommandFactory commandFac = new CommandFactory();
        Set<String> users = new HashSet<>();
        String line="";
        try {
            Process process = Runtime.getRuntime().exec(commandFac.getUsersCommand());
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
    private String getUserPath(String user) throws IOException, InterruptedException {
        CommandFactory commandFac = new CommandFactory();
        Process process = Runtime.getRuntime().exec(commandFac.getUserHomePathCommand(user));
        process.waitFor();
        InputStream input = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        String line=reader.readLine();
        return line;
    }
    private void saveLastCollectedTime() throws IOException {
        FileWriter writer = new FileWriter(BROWSING_LAST_COLLECTED_DATE);
        Date now = new Date();
        writer.write(String.valueOf(now.getTime()));
        writer.close();
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
    private void copyBrowsingDatabases(String userHomePath) throws IOException, InterruptedException {
        CommandFactory commandFact = new CommandFactory();
        String chromePath = commandFact.getChromeDbPath(userHomePath);
        String firefoxPath = commandFact.getFirefoxDbPath(userHomePath);
        Process process = Runtime.getRuntime().exec(commandFact.getCopyCommand(chromePath, CHROME_DB_COPY));
        process.waitFor();
        process = Runtime.getRuntime().exec(commandFact.getCopyCommand(firefoxPath, FIREFOX_DB_COPY));
        process.waitFor();
    }
    private void addEntriesToCachedFile(List<UrlEntry> entries) throws IOException {
        File file =new File(BROWSING_HISTORY_PATH);
        if(!file.exists()){
            file.createNewFile();
        }
        FileWriter writer = new FileWriter(BROWSING_HISTORY_PATH,true);
        for(int i=entries.size()-1; i>=0; i--)
            writer.write(entries.get(i).toString()+"\n");
        writer.close();
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
