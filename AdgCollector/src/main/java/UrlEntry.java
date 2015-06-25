import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.DoubleSummaryStatistics;

/**
 * Created by ayme on 6/10/15.
 */
public class UrlEntry {
    private String browser;
    private String username;
    private String url;
    private long visitDate;
    private String type;

    public UrlEntry(String browser, String username, String url, String visitDate, String type){
        this.browser=browser;
        this.username=username;
        this.url=extractDomain(url);
        if(isChromeBrowser()) this.visitDate=getTimestamp(visitDate);
        else if (isSafariBrowser()) this.visitDate=convertSafariDate(visitDate);
        else this.visitDate=(Long.parseLong(visitDate)/1000);
        this.type=type;
        System.out.println(visitDate);
    }
    private boolean isChromeBrowser(){
        return this.browser.equals("Chrome");
    }
    private boolean isSafariBrowser(){return this.browser.equals("Safari");}
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
        return this.username + " " + this.url + " " + this.visitDate + " " + this.type;
    }
    private long getTimestamp(String strDate){
        long sub=11644473600000L;
        Date date = new Date((Long.parseLong(strDate)/1000)-sub);
        return date.getTime();
    }
    private long convertSafariDate(String strDate){
        String macSecStr = strDate.substring(0,strDate.indexOf("."));
        long macSec = Long.parseLong(macSecStr);
        long epochSec = macSec+978307200;
        long epocMil = epochSec*1000;
        return epocMil;
    }
}
