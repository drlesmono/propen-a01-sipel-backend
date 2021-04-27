package propen.impl.sipel.service;

import propen.impl.sipel.model.OrderModel;
import propen.impl.sipel.model.ProjectInstallationModel;

import java.util.List;

public interface ProjectInstallationRestService {

    ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng);

    ProjectInstallationModel updateStatus(Long idOrderPi, String status);
}
