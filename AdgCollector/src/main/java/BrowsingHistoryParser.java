import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by ayme on 6/10/15.
 */
public class BrowsingHistoryParser {
    private BufferedReader reader;
    private String line;
    public BrowsingHistoryParser(InputStream input){
        this.reader = new BufferedReader(new InputStreamReader(input));
    }
    public boolean hasNextEntry(){
        try {
            while ((line = reader.readLine()) != null)
                return true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
    public UrlEntry getNextEntry(){
        String[] tokens = line.split("\\|");
        return new UrlEntry(tokens[0], tokens[1], Long.parseLong(tokens[2]), tokens[3], tokens[4]);
    }
}
