package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

import java.util.List;

public interface ManagedServicesRestService {
    ManagedServicesModel createOrderMS(ManagedServicesModel managedServices);

    ManagedServicesModel changeOrderMS(Long idOrderMS, ManagedServicesModel orderMSUpdate);

    ManagedServicesModel getMSOrderById(Long idOrderMS);

    Long setRem(ManagedServicesModel managedServices);

    List<ManagedServicesModel> retrieveMS();

    List<ManagedServicesModel> retrieveMSassigned();

    List<ManagedServicesModel> retrieveListMs();
}
