package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.TaskModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Optional;

import propen.impl.sipel.repository.UserDb;


@Service
@Transactional
public class ProjectInstallationRestServiceImpl implements ProjectInstallationRestService{

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Autowired
    private UserDb userDb;

    @Override
    public ProjectInstallationModel createOrderPI(ProjectInstallationModel projectInstallation) {
        //projectInstallation.setPercentage(0.00F);
        //projectInstallation.setClose(false);
        //projectInstallation.setDateClosedPI(null);

        return projectInstallationDb.save(projectInstallation);
    }

    /* @Override
    public ProjectInstallationModel changeOrderPI(OrderModel order, Long idOrder, ProjectInstallationModel orderPIUpdate) {
        ProjectInstallationModel orderPI = order.getIdOrderPi();
        orderPI.setStartPI(orderPIUpdate.getStartPI());
        orderPI.setDeadline(orderPIUpdate.getDeadline());
        orderPI.setPercentage(orderPIUpdate.getPercentage());
        orderPI.setIdUserEng(orderPIUpdate.getIdUserEng());
        orderPI.setClose(false);
        orderPI.setDateClosedPI(null);
        return projectInstallationDb.save(orderPI);
    } */

    @Override
    public ProjectInstallationModel changeOrderPI(Long idOrderPi, ProjectInstallationModel orderPIUpdate) {
        ProjectInstallationModel orderPI = getPIOrderById(idOrderPi);
        orderPI.setStartPI(orderPIUpdate.getStartPI());
        orderPI.setDeadline(orderPIUpdate.getDeadline());
        orderPI.setPercentage(orderPIUpdate.getPercentage());
        orderPI.setClose(orderPIUpdate.getClose());
        orderPI.setDateClosedPI(null);
        return projectInstallationDb.save(orderPI);
    }

    @Override
    public ProjectInstallationModel getPIOrderById(Long idOrderPI) {
        Optional<ProjectInstallationModel> orderPI = projectInstallationDb.findById(idOrderPI);
        if (orderPI.isPresent()) {
            return orderPI.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

//    @Override
//    public List<ProjectInstallationModel> retrievePI() {
//        return projectInstallationDb.findAll();
//    }

    // Mencari seluruh order yang memiliki jenis project installation
    @Override
    public List<ProjectInstallationModel> retrieveListPi() {
        return projectInstallationDb.findAll();
    }

    // Mengubah data pic engineer
    @Override
    public ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng) {
        ProjectInstallationModel piTarget = projectInstallationDb.findById(idOrderPi).get();
        piTarget.setIdUserEng(userDb.findById(idUserEng).get());
        return projectInstallationDb.save(piTarget);
    }

    @Override
    public List<ProjectInstallationModel> getListVerifiedPi(){

        List<ProjectInstallationModel> listPi = projectInstallationDb.findAll();
        List<ProjectInstallationModel> listVerifiedPi = new ArrayList<>();

        for (ProjectInstallationModel pi : listPi){
            if (pi.getIdOrder().getVerified()){
                listVerifiedPi.add(pi);
            }
        }
        return listVerifiedPi;
    }

    @Override
    public ProjectInstallationModel getProjectInstallationByIdOrderPi(Long idOrderPi){
        return projectInstallationDb.findByIdOrderPi(idOrderPi);
    }

    // Membuat list nama-nama bulan dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<String> getListBulanPi(Date startDate, Date endDate){
        List<String> listNamaBulan = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiMasukDateFiltered = new ArrayList<>();
        List<ProjectInstallationModel> listPiSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listPi.size(); i++){
            if (listPi.get(i).getIdOrder().getDateOrder().after(startDate) && listPi.get(i).getIdOrder().getDateOrder().before(endDate)){
                listPiMasukDateFiltered.add(listPi.get(i));
            }
        }
        for(int i = 0; i < listPi.size(); i++){
            if (!(listPi.get(i).getDateClosedPI() == null)){
                if (listPi.get(i).getDateClosedPI().after(startDate) && listPi.get(i).getDateClosedPI().before(endDate)){
                    listPiSelesaiDateFiltered.add(listPi.get(i));
                }
            }
        }
        listPiMasukDateFiltered.sort((o1, o2) -> o1.getIdOrder().getDateOrder().compareTo(o2.getIdOrder().getDateOrder()));
        listPiSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedPI().compareTo(o2.getDateClosedPI()));
        for(int i = 0; i < listPiMasukDateFiltered.size(); i++){
            Integer month = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
            Integer year = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getYear() + 1900;
            String monthInString = month.toString();
            String yearInString = year.toString();
            String monthLabel = monthInString + "." + yearInString;
            if (!listNamaBulan.contains(monthLabel)){
                listNamaBulan.add(monthLabel);
            }
        }
        for(int i = 0; i < listPiSelesaiDateFiltered.size(); i++){
            Integer month = listPiSelesaiDateFiltered.get(i).getDateClosedPI().getMonth() + 1;
            Integer year = listPiSelesaiDateFiltered.get(i).getDateClosedPI().getYear() + 1900;
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
    public List<Integer> getPiMasuk(Date startDate, Date endDate){
        List<Integer> jumlahPiMasukPerBulan = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiMasukDateFiltered = new ArrayList<>();

        for(int i = 0; i < listPi.size(); i++){
            if (listPi.get(i).getIdOrder().getDateOrder().after(startDate) && listPi.get(i).getIdOrder().getDateOrder().before(endDate)){
                listPiMasukDateFiltered.add(listPi.get(i));
            }
        }


        listPiMasukDateFiltered.sort((o1, o2) -> o1.getIdOrder().getDateOrder().compareTo(o2.getIdOrder().getDateOrder()));
        List<String> listNamaBulan = getListBulanPi(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listPiMasukDateFiltered.size(); j++){
                Integer month = listPiMasukDateFiltered.get(j).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listPiMasukDateFiltered.get(j).getIdOrder().getDateOrder().getYear() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahPiMasukPerBulan.add(counter);
        }
        System.out.println("ini jumlah pi masuk " + jumlahPiMasukPerBulan);
        return jumlahPiMasukPerBulan;


    }

    // Mencari jumlah PI yang selesai dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<Integer> getPiSelesai(Date startDate, Date endDate){
        List<Integer> jumlahPiSelesaiPerBulan = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listPi.size(); i++){
            if (!(listPi.get(i).getDateClosedPI() == null)){
                if (listPi.get(i).getDateClosedPI().after(startDate) && listPi.get(i).getDateClosedPI().before(endDate)){
                    listPiSelesaiDateFiltered.add(listPi.get(i));
                }
            }
        }
        listPiSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedPI().compareTo(o2.getDateClosedPI()));
        List<String> listNamaBulan = getListBulanPi(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listPiSelesaiDateFiltered.size(); j++){
                Integer month = listPiSelesaiDateFiltered.get(j).getDateClosedPI().getMonth() + 1;
                Integer year = listPiSelesaiDateFiltered.get(j).getDateClosedPI().getYear() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahPiSelesaiPerBulan.add(counter);
        }
        System.out.println("ini jumlah Pi selesai " + jumlahPiSelesaiPerBulan);
        return jumlahPiSelesaiPerBulan;
    }

    // Mencari jumlah PI yang selesai dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<Integer> getPiTepatWaktuTelat(Date startDate, Date endDate){
        List<Integer> jumlahPiTepatWaktuTelat = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listPi.size(); i++){
            if (!(listPi.get(i).getDateClosedPI() == null)){
                if (listPi.get(i).getDateClosedPI().after(startDate) && listPi.get(i).getDateClosedPI().before(endDate)){
                    listPiSelesaiDateFiltered.add(listPi.get(i));
                }
            }
        }
        listPiSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedPI().compareTo(o2.getDateClosedPI()));
        List<String> listNamaBulan = getListBulanPi(startDate,endDate);
        int telat = 0;
        int tepatWaktu = 0;
        for (int j = 0; j < listPiSelesaiDateFiltered.size(); j++){

            if (listPiSelesaiDateFiltered.get(j).getDateClosedPI().after(listPiSelesaiDateFiltered.get(j).getDeadline())){
                telat++;
            } else {
                tepatWaktu++;
            }
        }
        jumlahPiTepatWaktuTelat.add(tepatWaktu);
        jumlahPiTepatWaktuTelat.add(telat);
        System.out.println("ini jumlah Pi tepat waktu dan telat " + jumlahPiTepatWaktuTelat);
        return jumlahPiTepatWaktuTelat;
    }

    @Override
    public Integer getPiBelumSelesai(){
        Integer piBelumSelesai = 0;
        List<ProjectInstallationModel> listPi = retrieveListPi();
        for(ProjectInstallationModel pi : listPi){
            if (pi.getDateClosedPI() == null){
                piBelumSelesai++;
            }
        }
        return piBelumSelesai;
    }

    @Override
    public ProjectInstallationModel updateStatus(Long idOrderPi, String status) {
        ProjectInstallationModel piTarget = projectInstallationDb.findById(idOrderPi).get();
        piTarget.setStatus(status);
        return projectInstallationDb.save(piTarget);
    }

    @Override
    public void updateTask() {
        List<ProjectInstallationModel> listVerifiedPi = getListVerifiedPi();

        for (ProjectInstallationModel pi : listVerifiedPi) {
            List<TaskModel> listTask = pi.getListTask();
            Float persen = (float) 0;
            pi.setPercentage(persen);
            if (listTask!=null){
                for (TaskModel taskk : listTask){
                    pi.setPercentage(pi.getPercentage()+(taskk.getPercentage()/listTask.size()));
                }
            } else {
                Float persen1 = (float) 0;
                pi.setPercentage(persen1);
            }
            projectInstallationDb.save(pi);
        }
    }
}
