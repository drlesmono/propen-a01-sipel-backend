package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.InstallationReportModel;
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

@Service
@Transactional
public class InstallationReportRestServiceImpl implements InstallationReportRestService{

    @Autowired
    InstallationReportDb installationReportDb;

    @Autowired
    ReportDb reportDb;

    @Autowired
    ProjectInstallationDb projectInstallationDb;

    @Override
    public String createIrNum(InstallationReportModel ir) {
        ReportModel report = reportDb.findByIdInstallationReport(ir.getIdInstallationReport());

        String nomorIr = "";
        String pemisah = "/";
        String docId = "LMD-BAI";
        LocalDate dateCurrent = LocalDate.now();
        Date dateCurrentParsed = Date.from(dateCurrent.atStartOfDay(ZoneId.systemDefault()).toInstant());
        report.setUploadedDate(dateCurrentParsed);
        String date = dateCurrent.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String[] dateSplit = String.valueOf(date).split("-");
        String seqOrder = "0000" + String.valueOf(report.getIdReport());
        seqOrder = seqOrder.substring(seqOrder.length() - 3);

        nomorIr = nomorIr + seqOrder + pemisah + docId + pemisah + "020" + pemisah + dateSplit[1] + pemisah + dateSplit[2];

        return nomorIr;
    }

    @Override
    public InstallationReportModel updateIr(InstallationReportDto ir) {
        InstallationReportModel newIr = installationReportDb.findById(ir.getIdInstallationReport()).get();
        ProjectInstallationModel pi = projectInstallationDb.findById(ir.getIdOrderPi()).get();

        newIr.setIrNum(createIrNum(newIr));
        newIr.setNotes(ir.getNotes());
        newIr.setIdOrderPi(pi);
        return installationReportDb.save(newIr);
    }

}
