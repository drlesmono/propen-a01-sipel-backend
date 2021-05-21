package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.repository.MaintenanceDb;

public class MaintenanceRestServiceImpl implements MaintenanceRestService {
    @Autowired
    private MaintenanceDb maintenanceDb;

    @Override
    public MaintenanceModel createMaintenance (MaintenanceModel maintenance) {
        maintenance.setMaintained(true);
        return maintenanceDb.save(maintenance);
    }
}
