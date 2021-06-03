package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Date;

@Service
@Transactional
public class ProjectInstallationRestServiceImpl implements ProjectInstallationRestService{

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Autowired
    private UserDb userDb;

    // Mencari seluruh order yang memilikimn jenis project installation
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

    // Membuat list nama-nama bulan dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<String> getListBulan(Date startDate, Date endDate){
        List<String> listNamaBulan = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiMasukDateFiltered = new ArrayList<>();
        for(int i = 0; i < listPi.size(); i++){
            if (listPi.get(i).getIdOrder().getDateOrder().after(startDate) && listPi.get(i).getIdOrder().getDateOrder().before(endDate)){
                listPiMasukDateFiltered.add(listPi.get(i));
            }
        }
        listPiMasukDateFiltered.sort((o1, o2) -> o1.getIdOrder().getDateOrder().compareTo(o2.getIdOrder().getDateOrder()));
        for(int i = 0; i < listPiMasukDateFiltered.size(); i++){
            if (i == 0){
                Integer month = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                listNamaBulan.add(monthInString + "." + yearInString);
            } else {
                Integer month = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (!listNamaBulan.contains(monthLabel)){
                    listNamaBulan.add(monthLabel);
                }
            }
        }
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
        List<String> listNamaBulan = getListBulan(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listPiMasukDateFiltered.size(); j++){
                Integer month = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listPiMasukDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahPiMasukPerBulan.add(counter);
        }
        return jumlahPiMasukPerBulan;

    }

    // Mencari jumlah PI yang selesai dalam suatu timeframe tertentu (max 1 tahun)
    @Override
    public List<Integer> getPiSelesai(Date startDate, Date endDate){
        List<Integer> jumlahPiSelesaiPerBulan = new ArrayList<>();
        List<ProjectInstallationModel> listPi = retrieveListPi();
        List<ProjectInstallationModel> listPiSelesaiDateFiltered = new ArrayList<>();
        for(int i = 0; i < listPi.size(); i++){
            if (listPi.get(i).getDateClosedPI().after(startDate) && listPi.get(i).getDateClosedPI().before(endDate)){
                listPiSelesaiDateFiltered.add(listPi.get(i));
            }
        }
        listPiSelesaiDateFiltered.sort((o1, o2) -> o1.getDateClosedPI().compareTo(o2.getDateClosedPI()));
        List<String> listNamaBulan = getListBulan(startDate,endDate);
        for(int i = 0; i < listNamaBulan.size(); i++){
            int counter = 0;
            for (int j = 0; j < listPiSelesaiDateFiltered.size(); j++){
                Integer month = listPiSelesaiDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1;
                Integer year = listPiSelesaiDateFiltered.get(i).getIdOrder().getDateOrder().getMonth() + 1900;
                String monthInString = month.toString();
                String yearInString = year.toString();
                String monthLabel = monthInString + "." + yearInString;
                if (monthLabel.equals(listNamaBulan.get(i))){
                    counter++;
                }
            }
            jumlahPiSelesaiPerBulan.add(counter);
        }
        return jumlahPiSelesaiPerBulan;



    }
}
