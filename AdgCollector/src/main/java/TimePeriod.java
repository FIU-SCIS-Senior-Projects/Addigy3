/**
 * Created by ayme on 5/20/15.
 */
public class TimePeriod {
    private long startTime;
    private long endTime;
    public TimePeriod(long startTime, long endTime){
        this.startTime=startTime;
        this.endTime=endTime;
    }
    public long getStartTime(){
        return this.startTime;
    }
    public long getEndTime(){
        return this.endTime;
    }
    public String toString(){
        return this.startTime +" - "+ this.endTime;
    }
}
