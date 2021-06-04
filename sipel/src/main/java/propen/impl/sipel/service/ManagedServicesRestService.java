package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

public interface ManagedServicesRestService {
    ManagedServicesModel createOrderMS(ManagedServicesModel managedServices);

    ManagedServicesModel changeOrderMS(Long idOrderMS, ManagedServicesModel orderMSUpdate);

    ManagedServicesModel getMSOrderById(Long idOrderMS);

    Long setRem(ManagedServicesModel managedServices);

    List<ManagedServicesModel> retrieveMS();

    List<ManagedServicesModel> retrieveMSassigned();

    List<ManagedServicesModel> retrieveListMs();

    ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic);

    List<ManagedServicesModel> msOrderByActualEnd();

    ManagedServicesModel updateKontrak(Long idOrderMs, String idUserPic, Date actualStart, Date actualEnd);

    LinkedHashMap<String, String> retrievePercentageMs();
}
