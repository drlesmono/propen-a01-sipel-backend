package propen.impl.sipel.service;

import propen.impl.sipel.model.MaintenanceModel;

public interface MaintenanceRestService {

    MaintenanceModel updateStatus(Long idMaintenance, Boolean status);

}
