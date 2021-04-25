package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;

import java.util.List;

public interface ServicesRestService {
    List<ServicesModel> createServices(String[] serviceName, ServicesModel services, ManagedServicesModel managedServices);

    List<ServicesModel> changeServices(String[] serviceName, ManagedServicesModel managedServices);

    ServicesModel getServiceById(Long idServices);
}
