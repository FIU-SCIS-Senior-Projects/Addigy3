import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by ayme on 6/10/15.
 */
public class UrlEntry {
    private String username;
    private String url;
    private String title;
    private long visitCount;
    private long lastVisitDate;
    private long visitDate;

    public UrlEntry(String username, String url, String title, long visitCount, String lastVisitDate, String visitDate){
        this.username=username;
        this.url=extractDomain(url);
        this.title=title;
        this.visitCount=visitCount;
        this.lastVisitDate=getTimestamp(lastVisitDate);
        this.visitDate=getTimestamp(visitDate);
    }
//    public String toString(){
//        return "URL: " + this.url + "\n" +
//                "TITLE: " + this.title + "\n"+
//                "VISIT COUNT: " + this.visitCount + "\n" +
//                "LAST VISIT DATE: " + new SimpleDateFormat("yyyy/MM/dd HH:mm").format(this.lastVisitDate) + "\n"+
//                "VISIT DATE: " + new SimpleDateFormat("yyyy/MM/dd HH:mm").format(this.visitDate) + "\n";
//    }
    private String extractDomain(String url){
        try {
            URI uri = new URI(url);
            return uri.getHost();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return null;
    }
    public String toString(){
        return this.username + " " + this.url + " " + this.visitDate;
    }
    public String getUrl(){
        return this.url;
    }
    public String getTitle(){
        return this.title;
    }
    public long getVisitDate(){
        return this.visitDate;
    }
    private long getTimestamp(String strDate){
        long sub=11644473600000L;
        Date date = new Date((Long.parseLong(strDate)/1000)-sub);
        return date.getTime();
    }
}
