package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.List;

public interface ProjectInstallationRestService {

    List<ProjectInstallationModel> retrieveListPi();

    ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng);
}
