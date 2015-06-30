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
        JSONArray updates = new JSONArray();
        try {
            Process process = Runtime.getRuntime().exec("softwareupdate --list");
            InputStream input = process.getInputStream();
            Scanner scanner = new Scanner(new InputStreamReader(input));
            while(scanner.hasNext()) {
                String line = scanner.nextLine();
                int startIndex = line.indexOf('*');
                if (startIndex < 0) continue;
                String label = line.substring(startIndex + 1);
                updates.put(label);
                System.out.println(label);
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
