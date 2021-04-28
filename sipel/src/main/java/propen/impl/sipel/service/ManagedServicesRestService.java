package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

public interface ManagedServicesRestService{

    ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic);

    ManagedServicesModel updateStatus(Long idOrderMs, String status);

    ManagedServicesModel getMsById(Long idOrderMs);


}
