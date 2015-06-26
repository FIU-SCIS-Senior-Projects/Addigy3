import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.*;

/**
 * Created by ayme on 6/1/15.
 */
public class LoginCachedParser {
    public static final String LOGS_PATH = "/var/log/";
    public static final String LOGIN_HISTORY_PATH = LOGS_PATH+ "adgLoginHistoryLog";
    public LoginCachedParser(){

    }
    public JSONArray getUploadData() throws IOException {
        String line = "";
        HashMap<String,JSONObject> actHistory = new HashMap<>();
        JSONArray allHistory = new JSONArray();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(LOGIN_HISTORY_PATH));
            while ((line = reader.readLine()) != null) {
                if (line.isEmpty()) continue;
                String[] tokens = line.split("\\s+");
                String username = tokens[0];
                long loginTime = Long.parseLong(tokens[1]);
                JSONObject newEntry = new JSONObject();
                newEntry.put("login",loginTime);
                newEntry.put("logout",Long.parseLong(tokens[2]));
                newEntry.put("isUpdate", Integer.parseInt(tokens[3]));
                JSONObject userAct = actHistory.get(username);
                if(userAct==null){
                    userAct = new JSONObject();
                    userAct.put("username", username);
                    userAct.put("activity", new JSONArray());
                    actHistory.put(username, userAct);
                    allHistory.put(userAct);
                }
                JSONArray activity = userAct.getJSONArray("activity");
                activity.put(newEntry);
            }
        }catch (Exception e){
            System.out.println(e.getStackTrace());
        }
        return allHistory;
    }
}
