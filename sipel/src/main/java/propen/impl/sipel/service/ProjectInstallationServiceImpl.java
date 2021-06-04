package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.repository.ProjectInstallationDb;

import java.util.Optional;

@Service
@Transactional
public class ProjectInstallationServiceImpl implements ProjectInstallationService {
    @Autowired
    ProjectInstallationDb projectInstallationDb;

    @Override
    public void addOrderPI(ProjectInstallationModel projectInstallation) {
        projectInstallationDb.save(projectInstallation);
    }

    @Override
    public ProjectInstallationModel updateOrderPI(ProjectInstallationModel projectInstallationModel) {
        projectInstallationDb.save(projectInstallationModel);

        return projectInstallationModel;
    }

    @Override
    public Optional<ProjectInstallationModel> getOrderPIById(Long idOrder) {
        return projectInstallationDb.findById(idOrder);
    }
}
