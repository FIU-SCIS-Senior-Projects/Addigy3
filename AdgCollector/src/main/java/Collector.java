/**
 * Created by ayme on 5/20/15.
 */

public interface Collector {
    Object getData();
    String getKey();
    void collectData();
    void hasUploaded();
}
