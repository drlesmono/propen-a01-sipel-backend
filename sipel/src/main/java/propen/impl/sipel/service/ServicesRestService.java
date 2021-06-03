package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.rest.ServicesDto;


import java.util.List;

public interface ServicesRestService {
//    ServicesModel createServices(ServicesModel services, ManagedServicesModel managedServices);

//    ServicesModel changeServices(Long idService, ServicesModel service);

    ServicesModel getServiceById(Long idServices);

    List<ServicesModel> getListService(Long idOrderMS);

    List<ServicesModel> retrieveServices();

    void deleteService(Long idService);

    ServicesModel updateService(ServicesDto service);

    ServicesModel createService(ServicesDto service, Long idOrderMs);

}
