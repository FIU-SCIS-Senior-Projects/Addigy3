import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by ayme on 6/1/15.
 */
public class LoginCommandParser {
    private BufferedReader reader;
    private String line;
    public static final int MINUTES_IN_DAY = 1440;
    public static final int MINUTES_IN_HOUR = 60;
    public LoginCommandParser(InputStream input){
        this.reader = new BufferedReader(new InputStreamReader(input));
    }
    public boolean hasNextValidEntry(){
        try {
            while ((line = reader.readLine()) != null)
                if(isValidLine(line)) return true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
    public LoginEntry getNextValidEntry(){
        String[] tokens = line.split("\\s+");
        String username = tokens[0];
        long loginTime = getLoginTime(tokens);
        long logoutTime = getLogoutTime(tokens, loginTime);
        return new LoginEntry(username, loginTime, logoutTime );
    }

    private static boolean isValidLine(String line){
        return(!line.isEmpty()&&!line.startsWith("wtmp")&&!line.startsWith("reboot")&&!line.contains("pts")
                &&!line.startsWith("shutdown") && !line.startsWith("root")&&!line.contains("ttys"));
    }

    private static long getLoginTime(String[] tokens){
        int startP= 2;
        int endP= 5+1;
        String loginDate=tokens[startP];
        for(int i=startP+1; i<endP; i++){
            loginDate+=" "+tokens[i];
        }
        loginDate+=" " + Calendar.getInstance().get(Calendar.YEAR);
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
