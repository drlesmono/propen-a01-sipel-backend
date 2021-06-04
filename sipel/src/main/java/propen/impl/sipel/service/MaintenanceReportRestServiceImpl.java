package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.*;
import propen.impl.sipel.repository.MaintenanceDb;
import propen.impl.sipel.repository.MaintenanceReportDb;
import propen.impl.sipel.repository.ReportDb;
import propen.impl.sipel.rest.MaintenanceReportDto;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class MaintenanceReportRestServiceImpl implements MaintenanceReportRestService{

    @Autowired
    MaintenanceReportDb maintenanceReportDb;

    @Autowired
    ReportDb reportDb;

    @Autowired
    MaintenanceDb maintenanceDb;

    // Mencari seluruh maintenance report
    @Override
    public List<MaintenanceReportModel> retrieveListMr() {
        return maintenanceReportDb.findAll();
    }

    // Membuat nomor maintenance report
    @Override
    public String createMrNum(OrderModel order) {

        String nomorMr = "";
        String pemisah = "/";
        String docId = "LMD-REPORT";
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");
        String seqOrder = "0000" + String.valueOf(order.getIdOrder());
        seqOrder = seqOrder.substring(seqOrder.length() - 3);

        nomorMr = nomorMr + seqOrder + pemisah + docId + pemisah + "020" + pemisah + dateSplit[1] + pemisah + dateSplit[2];

        return nomorMr;
    }

    // Membuat maintenance report baru
    @Override
    public MaintenanceReportModel uploadMr(ReportModel report, MaintenanceReportDto mr) {
        MaintenanceReportModel newMr = new MaintenanceReportModel();
        MaintenanceModel maintenance = maintenanceDb.findById(mr.getIdMaintenance()).get();

        newMr.setIdReport(report);
        newMr.setMrNum(createMrNum(maintenance.getIdOrderMS().getIdOrder()));
        newMr.setNotes(mr.getNotes());
        newMr.setIdMaintenance(maintenance);
        return maintenanceReportDb.save(newMr);
    }

    @Override
    public MaintenanceReportModel updateNotes(Long idMaintenanceReport, MaintenanceReportModel maintenanceReport) {
        MaintenanceReportModel mrModel = maintenanceReportDb.findById(idMaintenanceReport).get();
        mrModel.setNotes(maintenanceReport.getNotes());
        return maintenanceReportDb.save(mrModel);
    }
}
