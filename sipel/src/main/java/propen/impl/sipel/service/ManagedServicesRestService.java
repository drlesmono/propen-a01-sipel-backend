package propen.impl.sipel.service;

import propen.impl.sipel.model.ManagedServicesModel;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

public interface ManagedServicesRestService{

    List<ManagedServicesModel> retrieveListMs();

    ManagedServicesModel updatePIC(Long idOrderMs, String idUserPic);

    List<ManagedServicesModel> msOrderByActualEnd();

    ManagedServicesModel updateKontrak(Long idOrderMs, String idUserPic, Date actualStart, Date actualEnd);

    LinkedHashMap<String, String> retrievePercentageMs();

//    List<Integer> getMsMasukDanSelesai(Date startDate, Date endDate);
}
