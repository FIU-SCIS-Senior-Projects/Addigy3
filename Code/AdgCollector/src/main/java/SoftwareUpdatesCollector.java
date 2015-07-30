import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Scanner;

/**
 * Created by ayme on 6/26/15.
 */
public class SoftwareUpdatesCollector implements Collector{
    @Override
    public Object getData() {
        System.out.println("Getting updates data to send to server...");
        JSONArray updates = new JSONArray();
        try {
            Process process = Runtime.getRuntime().exec("softwareupdate --list");
            InputStream input = process.getInputStream();
            Scanner scanner = new Scanner(new InputStreamReader(input));
            while(scanner.hasNext()) {
                String line = scanner.nextLine();
                int startIndex = line.indexOf('*');
                if (startIndex < 0) continue;
                String update = line.substring(startIndex + 1);
                line = scanner.nextLine();
                int endIndex = line.indexOf("(");
                String updateName = line.substring(0,endIndex);
                updateName.replace("(?i)update", "");
                updateName.trim();
                JSONObject currUpdate = new JSONObject();
                currUpdate.put("updateName",update);
                currUpdate.put("updateApp", updateName);
                updates.put(currUpdate);
                System.out.println(currUpdate);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return updates;
    }

    @Override
    public String getKey() {
        return "softwareUpdates";
    }

    @Override
    public void collectData() {}

    @Override
    public void hasUploaded() {}
}
