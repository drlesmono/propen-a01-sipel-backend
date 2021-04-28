package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.List;

public interface ProjectInstallationRestService {

    ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng);
    List<ProjectInstallationModel> getListVerifiedPi();
    ProjectInstallationModel getProjectInstallationByIdOrderPi(Long idOrderPi);
}
