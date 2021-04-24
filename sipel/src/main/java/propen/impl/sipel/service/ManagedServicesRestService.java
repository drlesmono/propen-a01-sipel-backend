package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

public interface ManagedServicesRestService{

    ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic);
}
