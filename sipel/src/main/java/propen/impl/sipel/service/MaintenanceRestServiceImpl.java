package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.repository.MaintenanceDb;
import propen.impl.sipel.repository.UserDb;

import javax.transaction.Transactional;

@Service
@Transactional
public class MaintenanceRestServiceImpl implements MaintenanceRestService{

    @Autowired
    private MaintenanceDb maintenanceDb;

    @Autowired
    private UserDb userDb;

    @Override
    public MaintenanceModel updateStatus(Long idMaintenance, Boolean status) {
        MaintenanceModel maintenanceTarget = maintenanceDb.findById(idMaintenance).get();
        maintenanceTarget.setMaintained(status);
        return maintenanceDb.save(maintenanceTarget);
    }
}
