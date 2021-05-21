package propen.impl.sipel.service;

import propen.impl.sipel.model.MaintenanceReportModel;
import propen.impl.sipel.rest.MaintenanceReportDto;

public interface MaintenanceReportRestService {

    String createMrNum(MaintenanceReportModel mr);

    MaintenanceReportModel updateMr(MaintenanceReportDto mr);

}
