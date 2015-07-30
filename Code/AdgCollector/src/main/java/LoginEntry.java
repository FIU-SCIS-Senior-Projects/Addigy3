/**
 * Created by ayme on 6/1/15.
 */
public class LoginEntry {
    private String username;
    private long loginTime;
    private long logoutTime;
    private int isUpdate;
    public LoginEntry(String username, long loginTime, long logoutTime){
        this.username = username;
        this.loginTime = loginTime;
        this.logoutTime = logoutTime;
        this.isUpdate = 0;
    }
    public void setIsUpdate(){
        isUpdate=1;
    }
    public long getLoginTime(){
        return this.loginTime;
    }
    public long getLogoutTime(){
        return this.logoutTime;
    }
    public String toString(){
        return this.username + " " + this.loginTime + " " + this.logoutTime + " " + this.isUpdate;
    }
}
