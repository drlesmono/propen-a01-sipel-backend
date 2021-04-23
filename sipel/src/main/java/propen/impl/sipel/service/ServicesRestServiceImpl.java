package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.repository.ServicesDb;
import propen.impl.sipel.rest.Setting;

import javax.transaction.Transactional;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
public class ServicesRestServiceImpl implements ServicesRestService {
    private final WebClient webClient;

    @Autowired
    private ServicesDb servicesDb;

    @Override
    public ServicesModel createServices(ServicesModel services) {
        return servicesDb.save(services);
    }

    @Override
    public ServicesModel changeServices(Long idServices, ServicesModel servicesUpdate) {
        ServicesModel service = getServiceById(idServices);
        service.setName(servicesUpdate.getName());
        service.setIdUser(servicesUpdate.getIdUser());
        return servicesDb.save(service);
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
