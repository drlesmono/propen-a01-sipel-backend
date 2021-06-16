package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.ServicesDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

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
    private UserDb userDb;

    @Autowired
    private ManagedServicesDb managedServicesDb;

    @Autowired
    private ServicesDb servicesDb;

//    @Override
//    public ServicesModel createServices(ServicesModel services, ManagedServicesModel managedServices) {
//        services.setIdOrderMS(managedServices);
//        return servicesDb.save(services);
//    }

//    @Override
//    public ServicesModel changeServices(Long idService, ServicesModel service) {
//        ServicesModel srvc = getServiceById(idService);
//        srvc.setName(service.getName());
//        return servicesDb.save(srvc);
//    }

    @Override
    public ServicesModel getServiceById(Long idServices) {
        Optional<ServicesModel> service = servicesDb.findById(idServices);
        if (service.isPresent()) {
            return service.get();
        }
        else {
            throw new NoSuchElementException();
        }
    }

    @Override
    public List<ServicesModel> getListService(Long idOrderMS) {
        List<ServicesModel> listServices = retrieveServices();
        List<ServicesModel> listServicesByIdOrderMS = new ArrayList<ServicesModel>();
        for (ServicesModel i : listServices) {
            if (i.getIdOrderMS().getIdOrderMs() == idOrderMS) {
                listServicesByIdOrderMS.add(i);
            }
        }
        return listServicesByIdOrderMS;
    }

    @Override
    public List<ServicesModel> retrieveServices() {
        return servicesDb.findAll();
    }

    @Override
    public void deleteService(Long idService) {
        ServicesModel service = getServiceById(idService);
        servicesDb.delete(service);
    }

    // Mengubah data service
    @Override
    public ServicesModel updateService(ServicesDto service) {
        ServicesModel serviceTarget = servicesDb.findById(service.getIdService()).get();
        if (service.getName() != null) serviceTarget.setName(service.getName());
        if (service.getIdUser() != null) serviceTarget.setIdUser(userDb.findById(service.getIdUser()).get());
        return servicesDb.save(serviceTarget);
    }

    @Override
    public ServicesModel createService(ServicesDto service, Long idOrderMs) {
        ServicesModel newService = new ServicesModel();
        ManagedServicesModel ms = managedServicesDb.findById(idOrderMs).get();
        if (service.getName() != null) newService.setName(service.getName());
        if (service.getIdUser() != null) newService.setIdUser(userDb.findById(service.getIdUser()).get());
        newService.setIdOrderMS(ms);
        return servicesDb.save(newService);
    }
}
