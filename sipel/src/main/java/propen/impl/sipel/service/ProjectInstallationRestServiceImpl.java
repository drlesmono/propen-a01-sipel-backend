package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ProjectInstallationRestServiceImpl implements ProjectInstallationRestService{

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Autowired
    private UserDb userDb;

    // Mencari seluruh order yang memilikimn jenis project installation
    @Override
    public List<ProjectInstallationModel> retrieveListPi() {
        return projectInstallationDb.findAll();
    }

    // Mengubah data pic engineer
    @Override
    public ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng) {
        ProjectInstallationModel piTarget = projectInstallationDb.findById(idOrderPi).get();
        piTarget.setIdUserEng(userDb.findById(idUserEng).get());
        return projectInstallationDb.save(piTarget);
    }
}
