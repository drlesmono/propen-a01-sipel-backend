package propen.impl.sipel.service;

import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.List;

public interface ProjectInstallationRestService {
    ProjectInstallationModel createOrderPI(ProjectInstallationModel projectInstallation);

    ProjectInstallationModel changeOrderPI(Long idOrderPI, ProjectInstallationModel orderPIUpdate);

    ProjectInstallationModel getPIOrderById(Long idOrderPI);

    List<ProjectInstallationModel> retrievePI();
}
