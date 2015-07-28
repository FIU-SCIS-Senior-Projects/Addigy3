/**
 * Created by matthewsaunders on 5/23/15.
 */
import java.io.*;
import org.json.*;

public class FacterCollector implements Collector {

        public Object getData(){

            try{
                String command = "bash scripts/facter.sh";
                String jsonSource = executeCommand(command);
                JSONObject obj = new JSONObject(new JSONTokener(jsonSource));

                JSONArray jsonReport = new JSONArray().put(obj);
                return jsonReport;
            }catch (Exception e) {
                e.printStackTrace();
            }

            return null;
        }

        public String getKey(){
            return "facterReport";
        }

    public void collectData() {}

    @Override
    public void hasUploaded() {}

    private String executeCommand(String command) {

            StringBuffer output = new StringBuffer();
            Process p;
            try {
                p = Runtime.getRuntime().exec(command);
                p.waitFor();
                BufferedReader reader =
                        new BufferedReader(new InputStreamReader(p.getInputStream()));

                String line = "";
                while ((line = reader.readLine())!= null) {
                    output.append(line);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            return output.toString();

        }

}
