package propen.impl.sipel.service;

import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.ReportDto;

import java.util.List;

public interface ReportRestService {

    List<ReportModel> retrieveListReport();

    ReportModel uploadReport(ReportDto report, String urlFile);

    void deleteReport(Long idReport);

    ReportModel findReportById(Long idReport);

    ReportModel findReportByReportName(String reportName);

    ReportModel updateStatus(Long idReport, ReportModel report);
}
