package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.UserModel;
import propen.impl.sipel.repository.MaintenanceDb;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

@Service
@Transactional
public class ManagedServicesRestServiceImpl implements ManagedServicesRestService{

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Autowired
    private UserDb userDb;

    @Autowired
    private MaintenanceDb maintenanceDb;

    @Override
    public List<ManagedServicesModel> retrieveListMs() {
        return managedServicesDb.findAll();
    }

    @Override
    public ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }

    @Override
    public List<ManagedServicesModel> msOrderByActualEnd() {
        return managedServicesDb.findByOrderByActualEnd();
    }

    @Override
    public ManagedServicesModel updateKontrak(Long idOrderMs, String idUserPic, Date actualStart, Date actualEnd) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setActualStart(actualStart);
        msTarget.setActualEnd(actualEnd);
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }

    @Override
    public LinkedHashMap<String, String> retrievePercentageMs() {
        List<ManagedServicesModel> listMs = managedServicesDb.findAll();
        List<Integer> listAmountMn = new ArrayList<>();
        List<String> termList = new ArrayList<>();
        List<MaintenanceModel> sequencedList = new ArrayList<>();
        for(ManagedServicesModel ms : listMs){
            Integer counter = 1;
            List<MaintenanceModel> maintenanceList = new ArrayList<>();
            List<MaintenanceModel> allMaintenance = maintenanceDb.findAll();
            for(MaintenanceModel mn: allMaintenance){
                Long idMS1 = mn.getIdOrderMS().getIdOrderMs();
                Long idMS2 = ms.getIdOrderMs();
                if(idMS1.equals(idMS2)){
                    maintenanceList.add(mn);
                }
            }
            Integer total = maintenanceList.size();
            listAmountMn.add(total);

            for(MaintenanceModel mn: allMaintenance){
                Long idMS1 = mn.getIdOrderMS().getIdOrderMs();
                Long idMS2 = ms.getIdOrderMs();
                if(idMS1.equals(idMS2)){
                    sequencedList.add(mn);
                    String term = String.valueOf(counter) +"/" +String.valueOf(total);
                    termList.add(term);
                    counter++;
                }
            }
        }
        LinkedHashMap<String, String> mapTermMn =new LinkedHashMap<String, String>();
        if(termList.size() == sequencedList.size()){
            System.out.println("Sama Ukurannya");
        }
        for(int x=0; x<termList.size(); x++){
            String term = termList.get(x);
            MaintenanceModel mn = sequencedList.get(x);
            String idMn = String.valueOf(mn.getIdMaintenance());
            mapTermMn.put(idMn, term);
        }

        return mapTermMn;
    }
}
