import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by ayme on 6/11/15.
 */
public class BrowsingHistoryCachedParser {
    public static final String BROWSING_HISTORY_PATH = "./logs/BrowsingHistoryLog";
    public BrowsingHistoryCachedParser(){

    }
    public JSONArray getUploadData() throws IOException {
        String line = "";
        Map<String,JSONArray> userDomains = new HashMap<>();
        Map<String,HashMap<String,JSONArray>> userDomainVisitDates = new HashMap<>();
        JSONArray allHistory = new JSONArray();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(BROWSING_HISTORY_PATH));
            while ((line = reader.readLine()) != null) {
                if (line.isEmpty()) continue;
                String[] tokens = line.split("\\s+");
                String username = tokens[0];
                String domain = tokens[1];
                long visitDate = Long.parseLong(tokens[2]);
                JSONArray domains = userDomains.get(username);
                if(domains==null){
                    domains = new JSONArray();
                    userDomains.put(username, domains);
                    HashMap<String, JSONArray>domainVisits = new HashMap<>();
                    userDomainVisitDates.put(username, domainVisits);
                    JSONObject currObj = new JSONObject();
                    currObj.put("username", username);
                    currObj.put("domains", domains);
                    allHistory.put(currObj);
                }
                HashMap<String, JSONArray> domainVisits = userDomainVisitDates.get(username);
                JSONArray visits = domainVisits.get(domain);
                if(visits==null){
                    JSONObject currDomain = new JSONObject();
                    visits = new JSONArray();
                    currDomain.put("domainName", domain);
                    currDomain.put("visitDates", visits);
                    domainVisits.put(domain,visits);
                    domains.put(currDomain);
                }
                visits.put(visitDate);
            }
        }catch (Exception e){
            System.out.println(e.getStackTrace());
        }
        return allHistory;
    }
}
