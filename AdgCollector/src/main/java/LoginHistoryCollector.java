import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by ayme on 5/20/15.
 */
public class LoginHistoryCollector implements Collector{
    public static final int MINUTES_IN_DAY = 1440;
    public static final int MINUTES_IN_HOUR = 60;
    public static final String MAC_LAST_COMMAND = "last";
    public static final String UNIX_LAST_COMMAND = "last -R";
    public static final String PROJECT_DIRECTORY = System.getProperty("user.home") + "/addigy/";
    public static final String LOGIN_HISTORY_PATH = PROJECT_DIRECTORY + "logs/loginHistoryLog";
    public static final String LOGIN_HAS_DATA_PATH = PROJECT_DIRECTORY + "logs/loginNewDataFlag";
    public static final String NEW_DATA = "1";
    public static final String NO_NEW_DATA = "0";

    public void collectData(){
        try {
            Process process = getProcess();
            saveNewData(process);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void hasUploaded() {
        updateNewDataFlag(NO_NEW_DATA);
    }
    public void updateNewDataFlag(String flag){
        try {
            createFileIfNotExists(LOGIN_HAS_DATA_PATH, NO_NEW_DATA);
            FileWriter writer = new FileWriter(LOGIN_HAS_DATA_PATH);
            writer.write(flag);
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public boolean loginHasNewData() throws IOException {
        createFileIfNotExists(LOGIN_HAS_DATA_PATH, NO_NEW_DATA);
        BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HAS_DATA_PATH));
        return reader.readLine().equals(NEW_DATA);
    }
    public void createFileIfNotExists(String filePath, String defaultValue) throws IOException{
        File file = new File(filePath);
        if(!file.exists()) {
            file.createNewFile();
            FileWriter writer = new FileWriter(LOGIN_HAS_DATA_PATH);
            writer.write(defaultValue);
            writer.close();
        }
    }

    public Object getData() {
        try {
            return buildJson(parseOutput());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    private static HashMap parseOutput() throws IOException {
        String delims = "[ ]+";
        String line = "";
        HashMap<String, List<TimePeriod>> actHistory = new HashMap<>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HISTORY_PATH));
            while ((line = reader.readLine()) != null) {
                String[] tokens = line.split(delims);
                List<TimePeriod> times = actHistory.get(tokens[0]);
                long loginTime = getLoginTime(tokens);
                if(times==null){
                    times=new ArrayList<>();
                    times.add(new TimePeriod(loginTime, getLogoutTime(tokens, loginTime)));
                    actHistory.put(tokens[0],times);
                }
                else{
                    times.add(new TimePeriod(loginTime, getLogoutTime(tokens, loginTime)));
                }
            }
            return actHistory;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    private Process getProcess() throws IOException {
        String command;
        String os = System.getProperty("os.name").toLowerCase();
        if (isUnix(os)) command=UNIX_LAST_COMMAND;
        else command=MAC_LAST_COMMAND;
        return Runtime.getRuntime().exec(command);
    }

    private void saveNewData(Process process) throws IOException {
        boolean firstRun = false;
        boolean hasNewData = loginHasNewData();
        boolean isFirstLineInFile = false;
        String delims = "[ ]+";
        String [] cachedTokens;
        String lastLine = getLastLine();
        if (lastLine==null){
            firstRun=true;
            lastLine="";
        }
        cachedTokens = lastLine.split(delims);
        BufferedReader stdInput = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        String dataToAdd="";
        while ((line = stdInput.readLine()) != null) {
            String[] currTokens = line.split(delims);
            if(!isRelevantLine(line)){
                continue;
            }
            if(firstRun) {
                appendTop(line);
                updateNewDataFlag(NEW_DATA);
                continue;
            }
            if(!continueScanning(cachedTokens, line, currTokens)){
                if(!dataToAdd.isEmpty()) addData(dataToAdd, isFirstLineInFile);
                break;
            }
            if(!hasNewData){
                PrintWriter pw = new PrintWriter(LOGIN_HISTORY_PATH);
                pw.close();
                isFirstLineInFile=true;
                updateNewDataFlag(NEW_DATA);
                hasNewData=true;
            }
            dataToAdd = dataToAdd.isEmpty()?line:line + "\n" + dataToAdd;
        }
        
    }
    private void appendTop(String lineToAdd) throws IOException {
        File mFile = new File(LOGIN_HISTORY_PATH);
        BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HISTORY_PATH));
        String result = "";
        String line = "";
        while( (line = reader.readLine()) != null){
            result = result + line + "\n";
        }
        result = lineToAdd + "\n" + result.trim();
        mFile.delete();
        FileOutputStream fos = new FileOutputStream(mFile);
        fos.write(result.getBytes());
        fos.flush();
    }
    private void addData(String lineToAdd, boolean isFirstLineInFile) throws IOException {
        FileWriter writer = new FileWriter(LOGIN_HISTORY_PATH,true); //the true will append the new data
        if (!isFirstLineInFile)
            writer.write("\n");
        writer.write(lineToAdd);//appends the string to the file
        writer.close();
    }
    private String getLastLine() throws IOException {
        File file = new File(LOGIN_HISTORY_PATH);
        if(!file.exists())
            file.createNewFile();
        BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HISTORY_PATH));
        String lastLine=null, line;
        while ((line = reader.readLine()) != null) {
            lastLine = line;
        }
        return lastLine;
    }
    private boolean continueScanning(String[] cachedTokens,String currLine, String [] currTokens){
        long cachedLogin = getLoginTime(cachedTokens);
        long currLogin = getLoginTime(currTokens);
        if(currLogin>cachedLogin || (currLogin==cachedLogin && !currLine.contains("still")))
            return true;
        return false;
    }

    public String getKey() {return "loginHistory";}

    public static boolean isMac(String os) {return (os.indexOf("mac") >= 0);}

    public static boolean isUnix(String os) {
        return (os.indexOf("nix") >= 0 || os.indexOf("nux") >= 0 || os.indexOf("aix") > 0 );
    }

    public static JSONArray buildJson(Map mp) throws JSONException {
        JSONArray allHistory = new JSONArray();
        Iterator iter = mp.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry pair = (Map.Entry)iter.next();
            JSONObject user = new JSONObject();
            JSONArray userActivity = new JSONArray();
            user.put("username", pair.getKey());
            List<TimePeriod> timePeriods = (List<TimePeriod>)pair.getValue();
            for(TimePeriod tp:timePeriods){
                JSONObject currAct = new JSONObject();
                currAct.put("start", tp.getStartTime());
                currAct.put("end", tp.getEndTime());
                userActivity.put(currAct);
            }
            user.put("activity",userActivity);
            allHistory.put(user);
            iter.remove(); // avoids a ConcurrentModificationException
        }
        return allHistory;
    }

    private static long getLoginTime(String[] tokens){
        int startP= 2;
        int endP= 5+1;
        String loginDate=tokens[startP];
        for(int i=startP+1; i<endP; i++){
            loginDate+=" "+tokens[i];
        }
        loginDate+=" " +Calendar.getInstance().get(Calendar.YEAR);
        DateFormat df = new SimpleDateFormat("EEE MMM dd kk:mm yyyy");
        try {
            Date result = df.parse(loginDate);
            long unixT=result.getTime()/ 1000L;
            return  unixT;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }
    private static long getLogoutTime(String[] tokens, long startTime){
        if(tokens[6].equals("still")){
            return 0;
        }
        return getDateFromDuration(tokens[tokens.length-1],startTime);
    }
    private static boolean isRelevantLine(String line){
        return(!line.isEmpty()&&!line.startsWith("wtmp")&&!line.startsWith("reboot")&&!line.contains("pts")
                &&!line.startsWith("shutdown") && !line.startsWith("root")&&!line.contains("ttys"));
    }
    private static long getDateFromDuration(String duration, long startTimeStamp){
        duration=duration.substring(1,duration.length()-1);
        long minutesToAdd = 0;
        if(duration.contains("+")){
            minutesToAdd+=getMinutesInDays(duration.substring(0,duration.indexOf("+")));
            duration=duration.substring(duration.indexOf("+"));
        }
        minutesToAdd+=getMinutesInHours(duration.substring(0,duration.indexOf(":")));
        int minutesCount = Integer.parseInt(duration.substring(duration.indexOf(":")+1));
        minutesToAdd+=minutesCount;

        Date startDate= new Date(startTimeStamp*1000);
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.MINUTE, (int)minutesToAdd);
        Date endTime=cal.getTime();
        return endTime.getTime()/ 1000L;
    }
    private static long getMinutesInDays(String days){
        int daysCount = Integer.parseInt(days);
        return daysCount * MINUTES_IN_DAY;
    }
    private static long getMinutesInHours(String hours){
        int hoursCount=Integer.parseInt(hours);
        return hoursCount * MINUTES_IN_HOUR;
    }
}