package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.ManagedServicesDb;
import propen.impl.sipel.repository.ServicesDb;
import propen.impl.sipel.repository.UserDb;
import propen.impl.sipel.rest.ServicesDto;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class ServicesRestServiceImpl implements ServicesRestService{

    @Autowired
    private ServicesDb servicesDb;

    @Autowired
    private UserDb userDb;

    @Autowired
    private ManagedServicesDb managedServicesDb;

    // Mengubah data service
    @Override
    public ServicesModel updateService(ServicesDto service) {
        ServicesModel serviceTarget = servicesDb.findById(service.getIdService()).get();
        serviceTarget.setName(service.getName());
        serviceTarget.setIdUser(userDb.findById(service.getIdUser()).get());
        return servicesDb.save(serviceTarget);
    }

    @Override
    public ServicesModel createService(ServicesDto service, Long idOrderMs) {
        ServicesModel newService = new ServicesModel();
        ManagedServicesModel ms = managedServicesDb.findById(idOrderMs).get();
        newService.setName(service.getName());
        newService.setIdUser(userDb.findById(service.getIdUser()).get());
        newService.setIdOrderMS(ms);
        return servicesDb.save(newService);
    }
}
