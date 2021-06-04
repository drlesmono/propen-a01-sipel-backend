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

    List<String> getListBulanMs(Date startDate, Date endDate);

    List<Integer> getMsMasuk(Date startDate, Date endDate);

    List<Integer> getMsSelesai(Date startDate, Date endDate);

    Integer getMsBelumSelesai();

    ManagedServicesModel updateStatus(Long idOrderMs, String status);
}
