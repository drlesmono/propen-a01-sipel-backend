package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

import java.util.List;

public interface ManagedServicesRestService{

    ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic);

    List<ManagedServicesModel> msOrderByTimeRemaining();
}
