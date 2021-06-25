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
        //managedServices.setTimeRemaining(setRem(managedServices));
        return managedServicesDb.save(managedServices);
    }

    @Override
    public ManagedServicesModel changeOrderMS(Long idOrderMS, ManagedServicesModel orderMSUpdate) {
        ManagedServicesModel orderMS = getMSOrderById(idOrderMS);
        orderMS.setActivated(orderMSUpdate.getActivated());
        orderMS.setDateClosedMS(null);
        //orderMS.setTimeRemaining(setRem(orderMSUpdate));
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
        Date today = new Date();
        List<ManagedServicesModel> msList = retrieveMS();
        List<ManagedServicesModel> msListAssigned = new ArrayList<ManagedServicesModel>();
        for (ManagedServicesModel i : msList) {
            if (i.getIdUserPic() != null && i.getDateClosedMS() == null && today.compareTo(i.getActualEnd()) < 0) {
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
        if(idUserPic != null) msTarget.setIdUserPic(userDb.findById(idUserPic).get());
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

    // Membuat list nama-nama bulan dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<String> getListBulanMs(Date startDate, Date endDate){
        List<String> listNamaBulan = new ArrayList<>();
        List<ManagedServicesModel> listMs = retrieveListMs();
        List<ManagedServicesModel> listMsMasukDateFiltered = new ArrayList<>();
        List<ManagedServicesModel> listMsSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listMs.size(); i++){
            if (listMs.get(i).getIdOrder().getDateOrder().after(startDate) && listMs.get(i).getIdOrder().getDateOrder().before(endDate)){
                listMsMasukDateFiltered.add(listMs.get(i));
            }
        }
        for(int i = 0; i < listMs.size(); i++){
            if (!(listMs.get(i).getDateClosedMS() == null)){
                if (listMs.get(i).getDateClosedMS().after(startDate) && listMs.get(i).getDateClosedMS().before(endDate)){
                    listMsSelesaiDateFiltered.add(listMs.get(i));
                }
            }
        }
        listMsMasukDateFiltered.sort((o1, o2) -> o1.getIdOrder().getDateOrder().compareTo(o2.getIdOrder().getDateOrder()));
        listMsSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedMS().compareTo(o2.getDateClosedMS()));
        for(int i = 0; i < listMsMasukDateFiltered.size(); i++){
            Integer month = listMsMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
            Integer year = listMsMasukDateFiltered.get(i).getIdOrder().getDateOrder().getYear() + 1900;
            String monthInString = month.toString();
            String yearInString = year.toString();
            String monthLabel = monthInString + "." + yearInString;
            if (!listNamaBulan.contains(monthLabel)){
                listNamaBulan.add(monthLabel);
            }
        }
        for(int i = 0; i < listMsSelesaiDateFiltered.size(); i++){
            Integer month = listMsSelesaiDateFiltered.get(i).getDateClosedMS().getMonth() + 1;
            Integer year = listMsSelesaiDateFiltered.get(i).getDateClosedMS().getYear() + 1900;
            String monthInString = month.toString();
            String yearInString = year.toString();
            String monthLabel = monthInString + "." + yearInString;
            if (!listNamaBulan.contains(monthLabel)){
                listNamaBulan.add(monthLabel);
            }
        }
        System.out.println("ini list bulan " + listNamaBulan);
        return listNamaBulan;

    }

    // Mencari jumlah PI yang masuk dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<Integer> getMsMasuk(Date startDate, Date endDate){
        List<Integer> jumlahMsMasukPerBulan = new ArrayList<>();
        List<ManagedServicesModel> listMs = retrieveListMs();
        List<ManagedServicesModel> listMsMasukDateFiltered = new ArrayList<>();

        for(int i = 0; i < listMs.size(); i++){
            if (listMs.get(i).getIdOrder().getDateOrder().after(startDate) && listMs.get(i).getIdOrder().getDateOrder().before(endDate)){
                listMsMasukDateFiltered.add(listMs.get(i));
            }
        }


        listMsMasukDateFiltered.sort((o1, o2) -> o1.getIdOrder().getDateOrder().compareTo(o2.getIdOrder().getDateOrder()));
        List<String> listNamaBulan = getListBulanMs(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listMsMasukDateFiltered.size(); j++){
                Integer month = listMsMasukDateFiltered.get(j).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listMsMasukDateFiltered.get(j).getIdOrder().getDateOrder().getYear() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahMsMasukPerBulan.add(counter);
        }
        System.out.println("ini jumlah pi masuk " + jumlahMsMasukPerBulan);
        return jumlahMsMasukPerBulan;


    }

    // Mencari jumlah PI yang selesai dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<Integer> getMsSelesai(Date startDate, Date endDate){
        List<Integer> jumlahMsSelesaiPerBulan = new ArrayList<>();
        List<ManagedServicesModel> listMs = retrieveListMs();
        List<ManagedServicesModel> listMsSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listMs.size(); i++){
            if (!(listMs.get(i).getDateClosedMS() == null)){
                if (listMs.get(i).getDateClosedMS().after(startDate) && listMs.get(i).getDateClosedMS().before(endDate)){
                    listMsSelesaiDateFiltered.add(listMs.get(i));
                }
            }
        }
        listMsSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedMS().compareTo(o2.getDateClosedMS()));
        List<String> listNamaBulan = getListBulanMs(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listMsSelesaiDateFiltered.size(); j++){
                Integer month = listMsSelesaiDateFiltered.get(j).getDateClosedMS().getMonth() + 1;
                Integer year = listMsSelesaiDateFiltered.get(j).getDateClosedMS().getYear() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahMsSelesaiPerBulan.add(counter);
        }
        System.out.println("ini jumlah Pi selesai " + jumlahMsSelesaiPerBulan);
        return jumlahMsSelesaiPerBulan;




    }

    @Override
    public Integer getMsBelumSelesai(){
        Integer msBelumSelesai = 0;
        List<ManagedServicesModel> listMs = retrieveListMs();
        for(ManagedServicesModel ms : listMs){
            if (ms.getDateClosedMS() == null){
                msBelumSelesai++;
            }
        }
        return msBelumSelesai;
    }

    @Override
    public ManagedServicesModel updateStatus(Long idOrderMs, String status) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setStatus(status);
        return managedServicesDb.save(msTarget);
    }
}
