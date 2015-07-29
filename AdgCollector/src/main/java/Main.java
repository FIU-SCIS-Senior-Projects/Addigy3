import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

public class Main {

    public static final String LOGS_PATH = "/var/log/";
    public static final String LAST_UPLOAD_TIME_PATH = LOGS_PATH + "adgLastUploadTime";
    public static final long UPLOAD_INTERVAL_SEC = 0;
    public static final String DEFAULT_ORG_ID = "Addigy";
    public static final String DEFAULT_CONNECTOR_ID = "1111";
    public static final String DEAFAULT_SERVER_ADDRESS = "http://127.0.0.1:8000/resource/storeCollectedData/";
    public static HashMap<String, String> collectorSettings;

    static Collector[] collectors=new Collector[]{
            new LoginHistoryCollector(),
            new BrowsingHistoryCollector(),
            new SoftwareUpdatesCollector(),
            new FacterCollector()
    };

    public static void main(String[] args) {
        collectorSettings = new HashMap<>();
        collectorSettings.put("org", DEFAULT_ORG_ID);
        collectorSettings.put("connector", DEFAULT_CONNECTOR_ID);
        collectorSettings.put("server", DEAFAULT_SERVER_ADDRESS);

        for (int i = 0; i < args.length; i++){
            String key = args[i];
            if(++i>args.length)
                break;
            String value = args[i];
            collectorSettings.put(key, value);
        }
        collect();
        try {
            if(needUpload()){
                uploadData();
                updateLogs();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private static void collect(){
        for(Collector c: collectors)
            c.collectData();
    }
    private static void uploadData() throws IOException {
        JSONObject toSend=new JSONObject();
        for(Collector c: collectors) {
            toSend.put(c.getKey(), c.getData());
            toSend.put("connectorId", collectorSettings.get("connector"));
            toSend.put("orgId", collectorSettings.get("org"));
        }
        System.out.println(toSend.toString());
        sendToServer(toSend.toString());
    }
    private static boolean needUpload() throws IOException {
        if(timesFileWasCreated())
            return true;
        BufferedReader reader = new BufferedReader(new FileReader(LAST_UPLOAD_TIME_PATH));
        String dateStr = reader.readLine();
        long lastTime = Long.parseLong(dateStr);
        long currTime = System.currentTimeMillis() / 1000L;
        return (currTime-lastTime)>=UPLOAD_INTERVAL_SEC;
    }
    public static boolean timesFileWasCreated() throws IOException {
        File file = new File(LAST_UPLOAD_TIME_PATH);
        if(!file.exists()) {
            file.createNewFile();
            FileWriter writer = new FileWriter(LAST_UPLOAD_TIME_PATH);
            writer.write(String.valueOf(System.currentTimeMillis() / 1000L));
            writer.close();
            return true;
        }
        return false;
    }
    private static void updateLogs() throws IOException {
        updateLastUploadDate();
        for(Collector c: collectors) {
            c.hasUploaded();
        }
    }
    private static void updateLastUploadDate() throws IOException{
        long currTime = System.currentTimeMillis() / 1000L;
        FileWriter writer = new FileWriter(LAST_UPLOAD_TIME_PATH);
        writer.write(String.valueOf(currTime));
        writer.close();
    }
    private static void sendToServer(String input) throws IOException {
        URL url = new URL(collectorSettings.get("server"));
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        OutputStream os = conn.getOutputStream();
        os.write(input.getBytes());
        os.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
        String output;
        System.out.println("Output from Server .... \n");
        while ((output = br.readLine()) != null) {
            System.out.println(output);
        }
        conn.disconnect();
    }
    private static String getConnectorId(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }
}
