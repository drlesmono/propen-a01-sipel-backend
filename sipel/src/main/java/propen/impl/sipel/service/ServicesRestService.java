package propen.impl.sipel.service;

import propen.impl.sipel.model.ServicesModel;

public interface ServicesRestService {
    ServicesModel createServices(ServicesModel services);

    ServicesModel changeServices(Long idServices, ServicesModel services);

    ServicesModel getServiceById(Long idServices);
}
