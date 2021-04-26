package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;

import javax.transaction.Transactional;

@Service
@Transactional
public class ManagedServiceRestServiceImpl implements ManagedServiceRestService{

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Override
    public ManagedServicesModel updatePIC(ManagedServicesModel ms) {
        ManagedServicesModel msTarget = managedServicesDb.findById(ms.getIdOrderMs()).get();
        msTarget.setIdUserPic(ms.getIdUserPic());
        return managedServicesDb.save(msTarget);
    }
}
