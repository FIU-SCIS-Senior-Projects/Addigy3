import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by ayme on 6/10/15.
 */
public class UrlEntry {
    private String browser;
    private String username;
    private String url;
    private long visitDate;

    public UrlEntry(String browser, String username, String url, String visitDate){
        this.browser=browser;
        this.username=username;
        this.url=extractDomain(url);
        this.visitDate=isChromeBrowser()?getTimestamp(visitDate):(Long.parseLong(visitDate)/1000);
        System.out.println(visitDate);
    }
//    public String toString(){
//        return "URL: " + this.url + "\n" +
//                "TITLE: " + this.title + "\n"+
//                "VISIT COUNT: " + this.visitCount + "\n" +
//                "LAST VISIT DATE: " + new SimpleDateFormat("yyyy/MM/dd HH:mm").format(this.lastVisitDate) + "\n"+
//                "VISIT DATE: " + new SimpleDateFormat("yyyy/MM/dd HH:mm").format(this.visitDate) + "\n";
//    }
    private boolean isChromeBrowser(){
        return this.browser.equals("Chrome");
    }
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
    private long getTimestamp(String strDate){
        long sub=11644473600000L;
        Date date = new Date((Long.parseLong(strDate)/1000)-sub);
        return date.getTime();
    }
}
