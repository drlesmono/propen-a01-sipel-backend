package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.Optional;

public interface ProjectInstallationService {
    void addOrderPI(ProjectInstallationModel projectInstallation);

    ProjectInstallationModel updateOrderPI(ProjectInstallationModel projectInstallationModel);

    Optional<ProjectInstallationModel> getOrderPIById(Long idOrder);


}
