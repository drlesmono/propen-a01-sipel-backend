package propen.impl.sipel.service;

import propen.impl.sipel.model.MaintenanceModel;

import java.util.List;

public interface MaintenanceRestService {
    MaintenanceModel createMaintenance (MaintenanceModel maintenance);

    List<MaintenanceModel> retrieveMaintenance();

    List<MaintenanceModel> retrieveMaintenanceMS(Long idOrderMs);
}
