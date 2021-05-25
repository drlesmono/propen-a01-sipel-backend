package propen.impl.sipel.service;

import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.model.ManagedServicesModel;

import java.util.List;

public interface MaintenanceRestService {
    MaintenanceModel createMaintenance (MaintenanceModel maintenance, ManagedServicesModel ms);

    List<MaintenanceModel> retrieveMaintenance();

    List<MaintenanceModel> retrieveMaintenanceMS(Long idOrderMs);

    MaintenanceModel getMaintenanceById(Long idMaintenance);

    MaintenanceModel changeMaintenance(Long idMaintenance, MaintenanceModel maintenance);

    void deleteMaintenance(Long idMaintenance);
}
