package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

import java.util.Optional;

public interface ManagedServicesService {
    void addOrderMS(ManagedServicesModel managedServices);

    ManagedServicesModel updateOrderMS(ManagedServicesModel managedServicesModel);

    Optional<ManagedServicesModel> getOrderMSById(Long idOrderMs);

    Long setTimeRem(ManagedServicesModel managedServices);
}
