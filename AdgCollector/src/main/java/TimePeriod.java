/**
 * Created by ayme on 5/20/15.
 */
public class TimePeriod {
    private long startTime;
    private long endTime;
    private int isUpdate;
    public TimePeriod(long startTime, long endTime, int isUpdate){
        this.startTime=startTime;
        this.endTime=endTime;
        this.isUpdate= isUpdate;
    }
    public long getStartTime(){
        return this.startTime;
    }
    public long getEndTime(){
        return this.endTime;
    }
    public long isUpdate(){return this.isUpdate;}
    public String toString(){
        return this.startTime +" - "+ this.endTime;
    }
}
