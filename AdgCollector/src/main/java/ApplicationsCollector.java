import java.io.*;
import java.util.*;

/**
 * Created by ayme on 6/24/15.
 */

public class ApplicationsCollector implements Collector {
    public static final int APP_LIFE_IN_MIN=15;
    public static final String LOGS_PATH = "/var/log/";
    public static final String RUNNING_APPS_SAVE_FILE_TAIL = "adgRunningApps.ser";
    @Override
    public Object getData() {
        return null;
    }

    @Override
    public String getKey() {
        return null;
    }

    @Override
    public void collectData() {
        List<String> users = getUsersList();
        for(String user:users){
            HashMap<String, ArrayList<ProcEntry>> oldRunningApps = getRunningApps(user);
            HashMap<String, ArrayList<ProcEntry>> newRunningApps = new HashMap<>();
            List<AppEntry> entriesToAdd = new ArrayList<>();
            if(oldRunningApps==null) oldRunningApps=new HashMap<>();
            try {
                Process process = Runtime.getRuntime().exec("bash scripts/iOSGetRunningApps.sh");
                InputStream input = process.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(input));
                String line="";
                while((line=reader.readLine())!=null){
                    int pathIdx = line.indexOf("/");
                    String appPath = line.substring(pathIdx);
                    String firstFields = line.substring(0,pathIdx).trim();
                    String [] tokens = firstFields.split("\\s+");
                    AppEntry currApp = new AppEntry(user, appPath, tokens[1], tokens[0], "syst");
                    String currAppName = currApp.getAppName();
                    int currAppPid = currApp.getAppPID();
                    long currAppStart=currApp.getStartTime();
                    ProcEntry currProcEntry = new ProcEntry(currAppPid, currAppStart);
                    ArrayList<ProcEntry> appPids = oldRunningApps.get(currAppName);
                    if(appPids==null){
                        entriesToAdd.add(currApp);
                        ArrayList<ProcEntry> pids = new ArrayList<>();
                        pids.add(currProcEntry);
                        newRunningApps.put(currAppName, pids);
                    }
                    else if(appPids.contains(currProcEntry)){
                        if(isNewEntry(currProcEntry.getProcStartTime())) {
                            currApp.setStartTime(System.currentTimeMillis());
                            entriesToAdd.add(currApp);
                        }
                        if(newRunningApps.get(currAppName)==null){
                            ArrayList<ProcEntry> pids = new ArrayList<>();
                            newRunningApps.put(currAppName, pids);
                        }
                        ArrayList<ProcEntry> pids = newRunningApps.get(currAppName);
                        pids.add(currProcEntry);
                    }
                    else{
                        entriesToAdd.add(currApp);
                        if(newRunningApps.get(currAppName)==null){
                            ArrayList<ProcEntry> pids = new ArrayList<>();
                            newRunningApps.put(currAppName, pids);
                        }
                        ArrayList<ProcEntry> pids = newRunningApps.get(currAppName);
                        pids.add(currProcEntry);
                    }
                }
                addEntriesToCachedFile(entriesToAdd);
                saveRunningApps(newRunningApps, user);
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }
    private List<String> getUsersList (){
        CommandFactory commandFac = new CommandFactory();
        Set<String> users = new HashSet<>();
        String line="";
        try {
            Process process = Runtime.getRuntime().exec(commandFac.getUsersCommand());
            InputStream input = process.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
            line=reader.readLine();
            if(line!=null){
                String tokens[] = line.split("\\s+");
                for(String token:tokens) {
                    users.add(token);
                }
            }
            List<String> allUsers = new ArrayList<>();
            allUsers.addAll(users);
            return allUsers;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    public boolean isNewEntry(long appStartTime){
        long currTime = System.currentTimeMillis();
            return (currTime-appStartTime)>APP_LIFE_IN_MIN*60*1000;
    }
    private void saveRunningApps(HashMap<String , ArrayList<ProcEntry>> runningApps, String user){
        try{
            FileOutputStream fos = new FileOutputStream(LOGS_PATH + user + RUNNING_APPS_SAVE_FILE_TAIL);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(runningApps);
            oos.close();
            fos.close();
        }catch(IOException ioe) {
            ioe.printStackTrace();
        }
    }

    private HashMap<String, ArrayList<ProcEntry>> getRunningApps(String user){
        File file = new File(LOGS_PATH + user + RUNNING_APPS_SAVE_FILE_TAIL);
        if(!file.exists())
            return new HashMap<String, ArrayList<ProcEntry>>();
        HashMap<String, ArrayList<ProcEntry>> runningApps = null;
        try {
            FileInputStream fis = new FileInputStream(LOGS_PATH + user + RUNNING_APPS_SAVE_FILE_TAIL);
            ObjectInputStream ois = new ObjectInputStream(fis);
            runningApps = (HashMap) ois.readObject();
            ois.close();
            fis.close();
        }catch(Exception ioe) {
            ioe.printStackTrace();
            return null;
        }
//        Set set = runningApps.entrySet();
//        Iterator iterator = set.iterator();
//        while(iterator.hasNext()) {
//            Map.Entry mentry = (Map.Entry)iterator.next();
//            System.out.print("key: "+ mentry.getKey() + " & Value: ");
//            System.out.println(mentry.getValue());
//        }
        return runningApps;
    }

    @Override
    public void hasUploaded() {

    }
    private void addEntriesToCachedFile(List<AppEntry> entries) throws IOException {
        File file =new File(BrowsingHistoryCollector.BROWSING_HISTORY_PATH);
        if(!file.exists()){
            file.createNewFile();
        }
        FileWriter writer = new FileWriter(BrowsingHistoryCollector.BROWSING_HISTORY_PATH,true);
        for(int i=entries.size()-1; i>=0; i--)
            writer.write(entries.get(i).toString()+"\n");
        writer.close();
    }
}
