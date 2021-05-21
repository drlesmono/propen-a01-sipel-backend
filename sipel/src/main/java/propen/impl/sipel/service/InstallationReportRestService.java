package propen.impl.sipel.service;

import propen.impl.sipel.model.InstallationReportModel;
import propen.impl.sipel.rest.InstallationReportDto;

public interface InstallationReportRestService {

    String createIrNum(InstallationReportModel ir);

    InstallationReportModel updateIr(InstallationReportDto ir);

}
