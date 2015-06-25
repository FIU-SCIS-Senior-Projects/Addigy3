import java.io.*;
import java.util.*;

/**
 * Created by ayme on 6/24/15.
 */

public class ApplicationsCollector implements Collector {
    public static final int APP_LIFE_IN_MIN=1;
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
        HashMap<String, ArrayList<ProcEntry>> oldRunningApps = getRunningApps();
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
                String appPath= line.substring(pathIdx);
                String firstFields = line.substring(0,pathIdx).trim();
                String [] tokens = firstFields.split("\\s+");
                AppEntry currApp = new AppEntry("ayme", appPath, tokens[1], tokens[0], "syst");
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
            saveRunningApps(newRunningApps);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public boolean isNewEntry(long appStartTime){
        long currTime = System.currentTimeMillis();
            return (currTime-appStartTime)>APP_LIFE_IN_MIN*60*1000;
    }
    private void saveRunningApps(HashMap<String , ArrayList<ProcEntry>> runningApps){
        try{
            FileOutputStream fos = new FileOutputStream("/Users/ayme/addigy/logs/runningApps.ser");
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(runningApps);
            oos.close();
            fos.close();
        }catch(IOException ioe) {
            ioe.printStackTrace();
        }
    }

    private HashMap<String, ArrayList<ProcEntry>> getRunningApps(){
        File file = new File("/Users/ayme/addigy/logs/runningApps.ser");
        if(!file.exists())
            return new HashMap<String, ArrayList<ProcEntry>>();
        HashMap<String, ArrayList<ProcEntry>> runningApps = null;
        try {
            FileInputStream fis = new FileInputStream("/Users/ayme/addigy/logs/runningApps.ser");
            ObjectInputStream ois = new ObjectInputStream(fis);
            runningApps = (HashMap) ois.readObject();
            ois.close();
            fis.close();
        }catch(Exception ioe) {
            ioe.printStackTrace();
            return null;
        }
        Set set = runningApps.entrySet();
        Iterator iterator = set.iterator();
        while(iterator.hasNext()) {
            Map.Entry mentry = (Map.Entry)iterator.next();
            System.out.print("key: "+ mentry.getKey() + " & Value: ");
            System.out.println(mentry.getValue());
        }
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
