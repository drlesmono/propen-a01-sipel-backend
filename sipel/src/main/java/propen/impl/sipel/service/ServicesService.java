package propen.impl.sipel.service;

import propen.impl.sipel.model.ServicesModel;

import java.util.List;

public interface ServicesService {
    void addServices(ServicesModel services);

    ServicesModel updateServices(ServicesModel servicesModel);
}
