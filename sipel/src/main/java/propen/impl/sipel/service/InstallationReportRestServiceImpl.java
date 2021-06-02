package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.repository.InstallationReportDb;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.repository.ReportDb;
import propen.impl.sipel.rest.InstallationReportDto;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class InstallationReportRestServiceImpl implements InstallationReportRestService{

    @Autowired
    InstallationReportDb installationReportDb;

    @Autowired
    ReportDb reportDb;

    @Autowired
    ProjectInstallationDb projectInstallationDb;

    // Mencari seluruh installation report
    @Override
    public List<InstallationReportModel> retrieveListIr() {
        return installationReportDb.findAll();
    }

    // Membuat nomor installation report
    @Override
    public String createIrNum(OrderModel order) {

        String nomorIr = "";
        String pemisah = "/";
        String docId = "LMD-BAI";
        LocalDate dateCurrent = LocalDate.now();
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");
        String seqOrder = "0000" + String.valueOf(order.getIdOrder());
        seqOrder = seqOrder.substring(seqOrder.length() - 3);

        nomorIr = nomorIr + seqOrder + pemisah + docId + pemisah + "020" + pemisah + dateSplit[1] + pemisah + dateSplit[2];

        return nomorIr;
    }

    // Membuat installation report baru
    @Override
    public InstallationReportModel uploadIr(ReportModel report, InstallationReportDto ir) {
        InstallationReportModel newIr = new InstallationReportModel();
        ProjectInstallationModel pi = projectInstallationDb.findById(ir.getIdOrderPi()).get();

        newIr.setIdReport(report);
        newIr.setIrNum(createIrNum(pi.getIdOrder()));
        newIr.setNotes(ir.getNotes());
        newIr.setIdOrderPi(pi);
        return installationReportDb.save(newIr);
    }

    @Override
    public InstallationReportModel updateNotes(Long idInstallationReport, InstallationReportModel installationReport) {
        InstallationReportModel newInstallationReport = installationReportDb.findById(idInstallationReport).get();
        newInstallationReport.setNotes(installationReport.getNotes());
        return installationReportDb.save(newInstallationReport);
    }
}
