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

    @Override
    public List<ServicesModel> createServices(String[] serviceName, ServicesModel services, ManagedServicesModel managedServices) {
        List<ServicesModel> listService = new ArrayList<>();
        for (int i = 0; i < serviceName.length; i++) {
            managedServices.addService(serviceName[i]);
            ServicesModel service = new ServicesModel();
            service.setName(serviceName[i]);
            service.setIdOrderMS(managedServices);
            servicesDb.save(services);
            listService.add(services);
        }
        return listService;
    }

    @Override
    public List<ServicesModel> changeServices(String[] serviceName, ManagedServicesModel managedServices) {
        List<ServicesModel> list = managedServices.getListService();
        if (list.size() == serviceName.length) {
            for (int i = 0; i < serviceName.length; i++) {
                ServicesModel service = list.get(i);
                service.setName(serviceName[i]);
                servicesDb.save(service);
            }
        }
        else if (list.size() < serviceName.length) {
            int j = serviceName.length - list.size();
            int k = list.size();
            for (int i = 0; i < j; i++) {
                ServicesModel s = new ServicesModel();
                s.setName(serviceName[k]);
                s.setIdOrderMS(managedServices);
                servicesDb.save(s);
                list.add(s);
                k++;
            }
        }
        return list;
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

    public ServicesRestServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(Setting.serviceURl).build();
    }
}
