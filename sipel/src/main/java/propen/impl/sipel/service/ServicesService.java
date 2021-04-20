package propen.impl.sipel.service;

import propen.impl.sipel.model.ServicesModel;

public interface ServicesService {
    void addServices(ServicesModel services);

    ServicesModel updateServices(ServicesModel servicesModel);
}
