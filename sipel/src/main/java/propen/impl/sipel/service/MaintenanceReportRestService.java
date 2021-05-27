package propen.impl.sipel.service;

import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ReportModel;
import propen.impl.sipel.rest.MaintenanceReportDto;

import java.util.List;

public interface MaintenanceReportRestService {

    List<MaintenanceReportModel> retrieveListMr();

    String createMrNum(OrderModel order);

    MaintenanceReportModel uploadMr(ReportModel report, MaintenanceReportDto mr);

    MaintenanceReportModel updateNotes(Long idMaintenanceReport, MaintenanceReportModel maintenanceReport);

}
