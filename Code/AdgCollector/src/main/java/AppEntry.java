import java.io.*;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by ayme on 6/24/15.
 */
public class AppEntry {
    public static final int SECONDS_IN_DAY = 86400;
    public static final int SECONDS_IN_HOUR = 3600;
    public static final int SECONDS_IN_MINUTES = 60;
    private String username;
    private String appName;
    private int appPID;
    private long startTime;
    private String type;
    public AppEntry(String username, String appName, String appPID, String startTimeStr, String type){
        this.username = username;
        this.appName = getBaseName(appName);
        this.appPID=Integer.parseInt(appPID);
        this.startTime=getStartTimestamp(startTimeStr);
        this.type=type;
    }

    private long getStartTimestamp(String startTimeStr){
        int days = 0, hours=0, min=0, sec=0;
        int daysStrPos = startTimeStr.indexOf("-");
        if(daysStrPos!=-1) days=Integer.parseInt(startTimeStr.substring(0,daysStrPos));
        else daysStrPos=0;
        startTimeStr=startTimeStr.substring(daysStrPos + 1);
        String [] timeTokens = startTimeStr.split(":");
        sec = Integer.parseInt(timeTokens[0]);
        if(timeTokens.length==2)
            min = Integer.parseInt(timeTokens[1]);
        else if(timeTokens.length==3){
            min = Integer.parseInt(timeTokens[1]);
            hours = Integer.parseInt(timeTokens[2]);
        }
        int totalSec= days*SECONDS_IN_DAY + hours*SECONDS_IN_HOUR + min*SECONDS_IN_MINUTES+sec;
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.SECOND, -totalSec);
        Date startDate = calendar.getTime();
        return startDate.getTime();
    }

    public String getAppName() {
        return appName;
    }

    public int getAppPID() {
        return appPID;
    }

    public long getStartTime() {
        return startTime;
    }
    public String toString(){
        return this.username + " " + this.appName + " " + this.startTime + " " + this.type;
    }
    private String getBaseName(String path){
        return (new File(path)).getName();
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }
}
