package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;
import propen.impl.sipel.model.ServicesModel;

import java.util.List;
import java.util.Optional;

public interface ManagedServicesService {
    void addOrderMS(ManagedServicesModel managedServices);

    ManagedServicesModel updateOrderMS(ManagedServicesModel managedServicesModel);

    Optional<ManagedServicesModel> getOrderMSById(Long idOrder);

    Long setTimeRem(ManagedServicesModel managedServices);
}
