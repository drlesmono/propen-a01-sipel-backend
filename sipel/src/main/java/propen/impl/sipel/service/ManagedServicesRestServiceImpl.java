package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.rest.Setting;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.repository.MaintenanceDb;
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

    @Override
    public ManagedServicesModel createOrderMS(ManagedServicesModel managedServices) {
        managedServices.setActivated(false);
        managedServices.setDateClosedMS(null);
        managedServices.setTimeRemaining(setRem(managedServices));
        return managedServicesDb.save(managedServices);
    }

    @Override
    public ManagedServicesModel changeOrderMS(Long idOrderMS, ManagedServicesModel orderMSUpdate) {
        ManagedServicesModel orderMS = getMSOrderById(idOrderMS);
        orderMS.setActivated(orderMSUpdate.getActivated());
        orderMS.setDateClosedMS(null);
        orderMS.setTimeRemaining(setRem(orderMSUpdate));
        orderMS.setActualStart(orderMSUpdate.getActualStart());
        orderMS.setActualEnd(orderMSUpdate.getActualEnd());
        return managedServicesDb.save(orderMS);
    }

    @Override
    public ManagedServicesModel getMSOrderById(Long idOrderMS) {
        Optional<ManagedServicesModel> orderMS = managedServicesDb.findById(idOrderMS);
        if (orderMS.isPresent()) {
            return orderMS.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public Long setRem(ManagedServicesModel managedServices) {
        Date startPeriod = managedServices.getActualStart();
        Date endPeriod = managedServices.getActualEnd();
        LocalDate ldStartPeriod = startPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate ldEndPeriod = endPeriod.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate dateStart = LocalDate.of(ldStartPeriod.getYear(), ldStartPeriod.getMonth(), ldStartPeriod.getDayOfMonth());
        LocalDate dateEnd = LocalDate.of(ldEndPeriod.getYear(), ldEndPeriod.getMonth(), ldEndPeriod.getDayOfMonth());
        Long days = ChronoUnit.DAYS.between(dateStart, dateEnd);

        return days;
    }

    @Override
    public List<ManagedServicesModel> retrieveMS() {
        return managedServicesDb.findAll();
    }

    @Override
    public List<ManagedServicesModel> retrieveMSassigned() {
        List<ManagedServicesModel> msList = retrieveMS();
        List<ManagedServicesModel> msListAssigned = new ArrayList<ManagedServicesModel>();
        for (ManagedServicesModel i : msList) {
            if (i.getIdUserPic() != null && i.getTimeRemaining() != 0 && i.getTimeRemaining() != null) {
                msListAssigned.add(i);
            }
        }
        return msListAssigned;
    }

    @Autowired
    private UserDb userDb;

    @Autowired
    private MaintenanceDb maintenanceDb;

    // Mencari seluruh order yang memiliki jenis managed service
    @Override
    public List<ManagedServicesModel> retrieveListMs() {
        return managedServicesDb.findAll();
    }

    // Mengubah data pic engineer
    @Override
    public ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }

    // Mencari seluruh order yang memiliki jenis managed service
    // Order diurutkan berdasarkan periode berakhir atau actual end
    @Override
    public List<ManagedServicesModel> msOrderByActualEnd() {
        return managedServicesDb.findByOrderByActualEnd();
    }

    // Mengubah data periode kontrak
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
