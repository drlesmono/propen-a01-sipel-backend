package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;

@Service
@Transactional
public class ManagedServicesRestServiceImpl implements ManagedServicesRestService{

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Autowired
    private UserDb userDb;

    @Override
    public ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setIdUserPic(userDb.findById(idUserPic).get());
        return managedServicesDb.save(msTarget);
    }

    @Override
    public ManagedServicesModel updateStatus(Long idOrderMs, String status) {
        ManagedServicesModel msTarget = managedServicesDb.findById(idOrderMs).get();
        msTarget.setStatus(status);
        return managedServicesDb.save(msTarget);
    }

    @Override
    public ManagedServicesModel getMsById(Long idOrderMs){
        return managedServicesDb.findById(idOrderMs).get();
    }
}
