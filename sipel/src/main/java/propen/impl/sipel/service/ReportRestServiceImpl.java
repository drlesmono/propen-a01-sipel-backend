package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.BastModel;
import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.repository.InstallationReportDb;
import propen.impl.sipel.repository.ReportDb;
import propen.impl.sipel.rest.ReportDto;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ReportRestServiceImpl implements ReportRestService{

    @Autowired
    ReportDb reportDb;

    @Override
    public List<ReportModel> retrieveListReport() {
        return reportDb.findAllByOrderByUploadedDateDesc();
    }

    @Override
    public ReportModel uploadReport(ReportDto report, String urlFile) {
        ReportModel newReport = new ReportModel();
        LocalDate localDate = LocalDate.now();
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        newReport.setReportName(report.getReportName());
        newReport.setUploadedDate(date);
        newReport.setStatusApproval(report.getStatusApproval());
        newReport.setSigned(report.getSigned());
        newReport.setReportType(report.getReportType());
        newReport.setUrlFile(urlFile);
        newReport.setFileType(report.getFileType());
        newReport.setSize(report.getSize());

//        if(report.getReportType().equals("installation")) {
//            InstallationReportModel ir = new InstallationReportModel();
//            newReport.setIdInstallationReport(ir);
//        }else if(report.getReportType().equals("maintenance")){
//            MaintenanceReportModel mr = new MaintenanceReportModel();
//            newReport.setIdMaintenanceReport(mr);
//        }else{
//            BastModel bast = new BastModel();
//            newReport.setIdBast(bast);
//        }

        return reportDb.save(newReport);
    }

    @Override
    public void deleteReport(Long idReport) {
        reportDb.deleteById(idReport);
    }

    @Override
    public ReportModel findReportById(Long idReport) {
        return reportDb.findById(idReport).get();
    }

    @Override
    public ReportModel findReportByReportName(String reportName) {
        return reportDb.findByReportName(reportName);
    }
}
