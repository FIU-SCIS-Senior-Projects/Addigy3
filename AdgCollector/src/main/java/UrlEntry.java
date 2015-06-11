import java.util.Date;

/**
 * Created by ayme on 6/10/15.
 */
public class UrlEntry {
    private String url;
    private String title;
    private long visitCount;
    private String lastVisitDate;
    private String visitDate;

    public UrlEntry(String url, String title, long visitCount, String lastVisitDate, String visitDate){
        this.url=url;
        this.title=title;
        this.visitCount=visitCount;
        this.lastVisitDate=lastVisitDate;
        this.visitDate=visitDate;
    }
    public String toString(){
        return "URL: " + this.url + "\n" +
                "TITLE: " + this.title + "\n"+
                "VISIT COUNT: " + this.visitCount + "\n" +
                "LAST VISIT DATE: " + this.lastVisitDate + "\n"+
                "VISIT DATE: " + this.visitDate + "\n";
    }
    private long getTimestamp(String strDate){
        long sub=11644473600000L;
        Date date = new Date((Long.parseLong(strDate)/1000)-sub);
        return date.getTime();
    }
}
