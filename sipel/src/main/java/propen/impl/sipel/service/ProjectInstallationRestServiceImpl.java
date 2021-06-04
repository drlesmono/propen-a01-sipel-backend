package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ProjectInstallationModel;
import propen.impl.sipel.repository.ProjectInstallationDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProjectInstallationRestServiceImpl implements ProjectInstallationRestService{

    @Autowired
    private ProjectInstallationDb projectInstallationDb;

    @Autowired
    private UserDb userDb;

    @Override
    public List<ProjectInstallationModel> retrieveListPi() {
        return projectInstallationDb.findAll();
    }

    @Override
    public ProjectInstallationModel updatePIC(Long idOrderPi, String idUserEng) {
        ProjectInstallationModel piTarget = projectInstallationDb.findById(idOrderPi).get();
        piTarget.setIdUserEng(userDb.findById(idUserEng).get());
        return projectInstallationDb.save(piTarget);
    }

    @Override
    public List<ProjectInstallationModel> getListVerifiedPi(){

        List<ProjectInstallationModel> listPi = projectInstallationDb.findAll();
        List<ProjectInstallationModel> listVerifiedPi = new ArrayList<>();

        for (ProjectInstallationModel pi : listPi){
            if (pi.getIdOrder().getVerified()){
                listVerifiedPi.add(pi);
            }
        }
        return listVerifiedPi;
    }

    @Override
    public ProjectInstallationModel getProjectInstallationByIdOrderPi(Long idOrderPi){
        return projectInstallationDb.findByIdOrderPi(idOrderPi);
    }
    
}
