import java.io.*;
import java.util.*;

/**
 * Created by ayme on 5/20/15.
 */
public class LoginHistoryCollector implements Collector{
    public static final String PROJECT_DIRECTORY = System.getProperty("user.home") + "/addigy/";
    public static final String LOGIN_HISTORY_PATH = PROJECT_DIRECTORY + "logs/loginHistoryLog";
    public static final String LOGIN_HAS_DATA_PATH = PROJECT_DIRECTORY + "logs/loginNewDataFlag";
    public static final String NEW_DATA = "1";
    public static final String NO_NEW_DATA = "0";

    public String getKey() {return "loginHistory";}
    public Object getData() {
        try {
            return new LoginCachedParser().getUploadData();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    public void collectData(){
        ArrayList<String> linesToAdd  = new ArrayList<>();
        try {
            long lastCachedLogin = getLastCachedLoginTime();
            boolean hasDataToUpload = loginHasNewData();
            if (!hasDataToUpload){
                File file = new File(LOGIN_HISTORY_PATH);
                file.delete();
            }
            Process process = getProcess();
            LoginCommandParser parser = new LoginCommandParser(process.getInputStream());
            while(parser.hasNextValidEntry()){
                LoginEntry currEntry = parser.getNextValidEntry();
                if (!isNewLoginEntry(lastCachedLogin, currEntry.getLoginTime(), currEntry.getLogoutTime()))
                    break;
                if (lastCachedLogin==currEntry.getLoginTime()&& currEntry.getLogoutTime()!=0)
                    currEntry.setIsUpdate();
                linesToAdd.add(currEntry.toString());
            }
            if(linesToAdd.size()>0) addEntriesToCachedFile(linesToAdd);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void addEntriesToCachedFile(List<String> entries) throws IOException {
        try{
            FileWriter writer = new FileWriter(LOGIN_HISTORY_PATH);
            for(int i=entries.size()-1; i>=0; i--)
                writer.write(entries.get(i)+"\n");
            writer.close();
            updateNewDataFlag(NEW_DATA);
        }
        catch (Exception e){
            System.out.println(e.getStackTrace());
        }
    }
    public boolean isNewLoginEntry(long lastCachedLogin, long currLogin, long currLogout) throws IOException {
        if (currLogin>lastCachedLogin) return true;
        return (currLogin==lastCachedLogin&&currLogout!=0);
    }
    public long getLastCachedLoginTime() throws IOException {
        try {
            File file = new File(LOGIN_HISTORY_PATH);
            if(!file.exists()) return 0;
            BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HISTORY_PATH));
            String lastLine=null, line;
            while ((line = reader.readLine()) != null) {
                if(!line.isEmpty()) lastLine = line;
            }
            String[] tokens = lastLine.split("\\s+");
            return Long.parseLong(tokens[1]);
        }
        catch (Exception e){
            System.out.println(e.getStackTrace());
        }
        return 0;
    }
    public boolean loginHasNewData() throws IOException {
        File file = new File(LOGIN_HAS_DATA_PATH);
        if(!file.exists()) return false;
        BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HAS_DATA_PATH));
        return reader.readLine().equals(NEW_DATA);
    }
    private Process getProcess() throws IOException {
        CommandFactory commandFac= new CommandFactory();
        return Runtime.getRuntime().exec(commandFac.getLoginHistoryCommand());
    }
    public static boolean isUnix(String os) {
        return (os.indexOf("nix") >= 0 || os.indexOf("nux") >= 0 || os.indexOf("aix") > 0 );
    }
    @Override
    public void hasUploaded() {
        updateNewDataFlag(NO_NEW_DATA);
    }
    public void updateNewDataFlag(String flag){
        try {
            FileWriter writer = new FileWriter(LOGIN_HAS_DATA_PATH);
            writer.write(flag);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}