import java.io.Serializable;

/**
 * Created by ayme on 6/25/15.
 */

public class ProcEntry implements Serializable {
    int procPid;
    long procStartTime;
    public ProcEntry(int procPid, long procStartTime){
        this.procPid=procPid;
        this.procStartTime=procStartTime;
    }

    public int getProcPid() {
        return procPid;
    }

    public long getProcStartTime() {
        return procStartTime;
    }

    public void setProcPid(int procPid) {
        this.procPid = procPid;
    }

    public void setProcStartTime(long procStartTime) {
        this.procStartTime = procStartTime;
    }
    @Override
    public boolean equals(Object other) {
        if (other == null) return false;
        if (this.getClass() != other.getClass()) return false;
        return (this.procPid == ((ProcEntry)other).procPid && this.procStartTime==((ProcEntry)other).procPid);
    }
}
