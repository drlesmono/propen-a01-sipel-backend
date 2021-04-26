package propen.impl.sipel.service;

import propen.impl.sipel.model.ServicesModel;
import propen.impl.sipel.rest.ServicesDto;

public interface ServicesRestService {

    void updateService(ServicesDto service);

    ServicesModel createService(ServicesDto service, Long idOrderMs);

}
