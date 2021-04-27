package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.ServicesDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ServicesRestServiceImpl implements ServicesRestService{

    @Autowired
    private ServicesDb servicesDb;

    @Autowired
    private UserDb userDb;

    @Override
    public ServicesModel updateEngineer(Long idService, String idUser) {
        ServicesModel serviceTarget = servicesDb.findById(idService).get();
        serviceTarget.setIdUser(userDb.findById(idUser).get());
        return servicesDb.save(serviceTarget);
    }

}
