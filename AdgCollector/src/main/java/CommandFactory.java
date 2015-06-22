import java.util.Map;

/**
 * Created by ayme on 6/19/15.
 */
public class CommandFactory {
    public static final String OS  = System.getProperty("os.name").toLowerCase();
    public CommandFactory(){}
    public String[] getUserHomePathCommand(String user){
        if(isUnix()) {
            String grepCmd="grep " + user + " /etc/passwd | cut -d \":\" -f6";
            String[] command = {"/bin/sh", "-c", grepCmd};
            return command;
        }
        String dsclCommand= "dscl . -read Users/" + user + " NFSHomeDirectory";
        String[] command = {"/bin/sh", "-c", dsclCommand};
        return command;
    }

    public String getUsersCommand(){
        if(isUnix()) return "users";
        else if(isMac()) return "dscl /Local/Default -list /Users uid | awk '$2 >= 100 && $0 !~ /^_/ { print $1 }";
        else throw new UnsupportedOperationException("Operating system not supported");
    }
    public String getLoginHistoryCommand(){
        if(isUnix()) return "last -R";
        else if(isMac()) return "last";
        else throw new UnsupportedOperationException("Operating system not supported");
    }
    public String getChromeDbPath(String userHomePath){
        if(isUnix()) return  userHomePath + "/.config/google-chrome/Default/History";
        else if(isMac()) return userHomePath + "/Library/Application Support/Google/Chrome/";
        else throw new UnsupportedOperationException("Operating system not supported");
    }
    public String getFirefoxDbPath(String userHomePath){
        if(isUnix()) return userHomePath + "/.mozilla/firefox/cz7tfo3b.default/places.sqlite";
        else if(isMac()) return userHomePath + "/Library/Application Support/Firefox/Profiles/default.lov/places.sqlite";
        else throw new UnsupportedOperationException("Operating system not supported");
    }
    public String[] getCopyCommand(String source, String dest){
        String cpCommand="cp " + source + " " +dest;
        String[] command = {"/bin/sh", "-c", cpCommand};
        return command;
    }
    public static boolean isUnix() {
        return (OS.indexOf("nix") >= 0 || OS.indexOf("nux") >= 0 || OS.indexOf("aix") > 0 );
    }
    public static boolean isWindows() {
        return (OS.indexOf("win") >= 0);
    }
    public static boolean isMac() {
        return (OS.indexOf("mac") >= 0);
    }
    public static boolean isSolaris() {
        return (OS.indexOf("sunos") >= 0);
    }

}
