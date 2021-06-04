package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.*;
import propen.impl.sipel.repository.*;

import javax.sql.rowset.BaseRowSet;
import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class BastServiceImpl implements BastService {

    @Autowired
    BastDb bastDb;

    @Autowired
    MaintenanceDb maintenanceDb;

    @Autowired
    ProjectInstallationDb projectInstallationDb;

    @Autowired
    ManagedServicesDb managedServicesDb;

    @Autowired
    ReportDb reportDb;

    @Autowired
    OrderDb orderDb;


    @Override
    public void addBast(BastModel bastModel) {
        bastDb.save(bastModel);
    }

    @Override
    public List<BastModel> getBastList() {
        return bastDb.findAll();
    }

    @Override
    public BastModel getBastById(Long idBast) {
        return bastDb.findById(idBast).get();
    }

    @Override
    public ReportModel createReportModel(ReportModel reportModel) {

        reportDb.save(reportModel);
        ReportModel returned = null;
        List<ReportModel> listReport= reportDb.findAll();
        for(ReportModel report : listReport){
            if(report.getReportName() == reportModel.getReportName()){
                returned = report;
                break;
            }

        }        return returned;
    }

    @Override
    public ReportModel createReport(String type) throws ParseException {
        ReportModel report = new ReportModel();
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");
        String reportName = null;

        if(type.toLowerCase() == "pi"){
            reportName = "BAST/PI/" + dateSplit[0]+"/"+dateSplit[1]+"/"+dateSplit[2];
        }
        if(type.toLowerCase() == "mn"){
            reportName = "BAST/MN/" + dateSplit[0]+"/"+dateSplit[1]+"/"+dateSplit[2];
        }

        report.setReportName(reportName);
        report.setReportType("BAST");
        report.setSigned(false);
        report.setStatusApproval("Pending");
        report.setFileType("");
        report.setSize(Long.valueOf("1"));
        report.setUrlFile("---");
        report.setUploadedDate(new SimpleDateFormat("dd-MM-yyyy").parse(date));
        reportDb.save(report);

        List<ReportModel> listReport= reportDb.findAll();
        for(ReportModel laporan : listReport){
            if(laporan.getReportName() == report.getReportName()){
                report = laporan;
                break;
            }
        }

        List<BastModel> bastModels = bastDb.findAll();
        List<MaintenanceModel> maintenanceModels = maintenanceDb.findAll();
        for(BastModel bast: bastModels){
            if(bast.getIdReport() == report){
                MaintenanceModel main = bast.getIdMaintenance();
                Integer indeks = maintenanceModels.indexOf(main);
                main = maintenanceModels.get(indeks);
                //main.setBast(bast);
                maintenanceDb.save(main);
            }
        }
        return report;
    }

    @Override
    public void changeReportName(BastModel bastModel) {
        Long idSelected = bastModel.getIdReport().getIdReport();
        ReportModel report = reportDb.findById(idSelected).get();

        String bastnum = createBastNum(bastModel);

        report.setReportName(bastnum);
        reportDb.save(report);
    }

    @Override
    public String createBastNum(BastModel bastModel) {
        String nomorBast = "";
        String pemisah = "/";
        String docId = "LMD-BAST";
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");
        String seqOrder = "0000" + String.valueOf(getIdOrder(bastModel));
        seqOrder = seqOrder.substring(seqOrder.length() - 3);

        nomorBast = nomorBast + seqOrder + pemisah + docId + pemisah + "020" + pemisah + dateSplit[1] + pemisah + dateSplit[2];

        return nomorBast;
    }

    @Override
    public Long getIdOrder(BastModel bastModel) {
        ProjectInstallationModel idPi = bastModel.getIdOrderPi();
        MaintenanceModel idMain = bastModel.getIdMaintenance();

        Long toBeReturned;

        if(idPi == null){
            toBeReturned = idMain.getIdOrderMS().getIdOrder().getIdOrder();
        }
        else{
            toBeReturned = idPi.getIdOrder().getIdOrder();
        }
        return toBeReturned;
    }

    @Override
    public List<OrderModel> getOrderList() {
        List<OrderModel> orderList = orderDb.findAll();
        return orderList;
    }

    @Override
    public List<MaintenanceModel> getMaintenanceList(String keyword) {
        List<MaintenanceModel> maintenanceModels = maintenanceDb.findAll();
        List<MaintenanceModel> idToRetrieveBast = maintenanceModels;
        List<BastModel> BastList = bastDb.findAll();
        //maintenanceDb.findById(Long.valueOf("2"));
        if(keyword.toLowerCase() == "create"){
            for(int x=0; x<BastList.size(); x++){
                BastModel bast = BastList.get(x);
                MaintenanceModel mns = bast.getIdMaintenance();
                Boolean isNull = mns == null;
                if(!isNull){
                    if(this.getReportByBast(bast).getStatusApproval().toLowerCase() == "approved"){
                        idToRetrieveBast.remove(mns);
                    }
                }

            }
        }
        return idToRetrieveBast;
    }

    @Override
    public List<ProjectInstallationModel> getPiList(String keyword) {
        List<ProjectInstallationModel> projectInstallationModels = projectInstallationDb.findAll();
        List<ProjectInstallationModel> idToRetrieveBast = projectInstallationModels;
        List<BastModel> BastList = bastDb.findAll();
        if(keyword.toLowerCase() == "create"){
            for(int x=0; x<BastList.size(); x++){
                BastModel bast = BastList.get(x);
                ProjectInstallationModel pi = bast.getIdOrderPi();
                Boolean isNull = pi == null;
                if(!isNull){
                    ReportModel report = this.getReportByBast(bast);
                    String stat = report.getStatusApproval().toLowerCase();
                    Boolean isRemove = stat.equals("approved");
                    if(isRemove){
                        System.out.println("appapa");
                        idToRetrieveBast.remove(pi);
                    }

                }
            }
            /*
            for(int i = 0; i<projectInstallationModels.size(); i++){
                ProjectInstallationModel pi = projectInstallationModels.get(i);
                List<BastModel> bast_pi = pi.getIdBast();
                if(bast_pi.size() == 0){
                    if (pi.getClose() == true){
                    }else{
                        idToRetrieveBast.add(pi);
                    }
                }
                else{
                    Boolean anyApprove = false;
                    for(int j=0; j<bast_pi.size(); j++){

                        ReportModel report = bast_pi.get(i).getIdReport();
                        String status = report.getStatusApproval().toLowerCase().substring(0,2);
                        String checker = "ap";
                        boolean checkSame = status.equals(checker);
                        if(checkSame== true){
                            anyApprove = true;
                            if(idToRetrieveBast.contains(pi)){
                                idToRetrieveBast.remove(pi);
                            }
                        }
                    }
                    if(anyApprove==false){
                        idToRetrieveBast.add(pi);
                    }

                }
            }
            */
        }
        else{
            idToRetrieveBast = projectInstallationModels;
        }
        return idToRetrieveBast;
    }

    @Override
    public ProjectInstallationModel getPi(Long idOrderPi) {
        List<ProjectInstallationModel> projectInstallationModels = projectInstallationDb.findAll();
        ProjectInstallationModel piSelected = null;
        for(ProjectInstallationModel pi: projectInstallationModels){
            if(pi.getIdOrderPi() == idOrderPi){
                piSelected = pi;
            }
        }
        return piSelected;
    }

    @Override
    public MaintenanceModel getMn(Long idMaintenance) {
        List<MaintenanceModel> maintenanceModels = maintenanceDb.findAll();
        MaintenanceModel mnSelected = null;
        for(MaintenanceModel mn: maintenanceModels){
            if(mn.getIdMaintenance() == idMaintenance){
                mnSelected = mn;
            }
        }
        return mnSelected;
    }

    @Override
    public List<ManagedServicesModel> getMSList() {
        return managedServicesDb.findAll();
    }

    @Override
    public BastModel getBastByNum(String bastNum) {
        List<BastModel> bastList = bastDb.findAll();
        BastModel bastR = null;
        for(BastModel bast: bastList){
            if (bast.getBastNum()== bastNum){
                bastR = bast; }
        }
        return bastR;
    }

    @Override
    public OrderModel getOrderFromBast(BastModel bastModel) {
        List<OrderModel> allOrder = orderDb.findAll();
        OrderModel orderR = null;

        if(bastModel.getIdOrderPi()!= null){
            List<ProjectInstallationModel> piList = getPiList("all");
            for(ProjectInstallationModel pi : piList){
                if(pi.getIdOrderPi()==bastModel.getIdOrderPi().getIdOrderPi()){
                    orderR = pi.getIdOrder();
                    break;
                }
            }
        }
        else{
            List<MaintenanceModel> maintenanceList = getMaintenanceList("all");
            for(MaintenanceModel mn : maintenanceList){
                if(mn.getIdMaintenance() == bastModel.getIdMaintenance().getIdMaintenance()){
                    orderR = mn.getIdOrderMS().getIdOrder();
                    break;
                }

            }        }
        return orderR;
    }

    @Override
    public BastModel approveBast(BastModel bastModel) {
        Long idSelected = bastModel.getIdReport().getIdReport();
        ReportModel report = reportDb.findById(idSelected).get();

        report.setStatusApproval("Approved");
        //reportDb.save(report);
        return bastModel;
    }

    @Override
    public ReportModel approveBastFromLaporan(Long idReport) {
        ReportModel report = reportDb.findById(idReport).get();

        report.setStatusApproval("Approved");
        return report;
    }

    @Override
    public BastModel rejectBast(BastModel bastModel) {
        Long idSelected = bastModel.getIdReport().getIdReport();
        ReportModel report = reportDb.findById(idSelected).get();

        report.setStatusApproval("Rejected");
        //reportDb.save(report);
        return bastModel;
    }

    @Override
    public ReportModel rejectBastFromLaporan(Long idReport) {
        ReportModel report = reportDb.findById(idReport).get();

        report.setStatusApproval("Rejected");
        return report;
    }

    @Override
    public List<ReportModel> getAllReport() {
        List<ReportModel> allReport = reportDb.findAll();
        return allReport;
    }

    @Override
    public ReportModel getReportByBast(BastModel bastModel) {
        List<ReportModel> allReport = reportDb.findAll();
        ReportModel selected = null;
        for(ReportModel report: allReport){
            if(bastModel.getIdReport() == report){
                selected=report;
            }
        }
        return selected;
    }
}
