package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.repository.MaintenanceDb;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class MaintenanceRestServiceImpl implements MaintenanceRestService {
    @Autowired
    private MaintenanceDb maintenanceDb;

    @Override
    public MaintenanceModel createMaintenance (MaintenanceModel maintenance) {
        maintenance.setMaintained(true);
        return maintenanceDb.save(maintenance);
    }

    @Override
    public List<MaintenanceModel> retrieveMaintenance() {
        return maintenanceDb.findAll();
    }

    @Override
    public List<MaintenanceModel> retrieveMaintenanceMS(Long idOrderMs) {
        List<MaintenanceModel> mnList = retrieveMaintenance();
        List<MaintenanceModel> mnListMS = new ArrayList<MaintenanceModel>();
        for (MaintenanceModel i : mnList) {
            if (i.getIdOrderMS().getIdOrderMs() == idOrderMs) {
                mnListMS.add(i);
            }
        }
        return mnListMS;
    }
}
