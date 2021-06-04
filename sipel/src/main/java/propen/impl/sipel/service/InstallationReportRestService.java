package propen.impl.sipel.service;

import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.InstallationReportDto;

import java.util.List;

public interface InstallationReportRestService {

    List<InstallationReportModel> retrieveListIr();

    String createIrNum(OrderModel order);

    InstallationReportModel uploadIr(ReportModel report, InstallationReportDto ir);

    InstallationReportModel updateNotes(Long idInstallationReport, InstallationReportModel installationReport);

}
