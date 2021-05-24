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

@Service
@Transactional
public class ServicesRestServiceImpl implements ServicesRestService {
    private final WebClient webClient;

    @Autowired
    private ServicesDb servicesDb;

    @Autowired
    private ManagedServicesRestService managedServicesRestService;

    @Override
    public ServicesModel createServices(ServicesModel services, ManagedServicesModel managedServices) {
        services.setIdOrderMS(managedServices);
        return servicesDb.save(services);
    }

    @Override
    public ServicesModel changeServices(Long idService, ServicesModel service) {
        ServicesModel srvc = getServiceById(idService);
        srvc.setName(service.getName());
        return servicesDb.save(srvc);
    }

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

    public ServicesRestServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(Setting.serviceURl).build();
    }
}
