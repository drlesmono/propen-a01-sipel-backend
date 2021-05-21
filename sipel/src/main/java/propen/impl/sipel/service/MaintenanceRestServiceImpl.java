package propen.impl.sipel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import propen.impl.sipel.model.MaintenanceModel;
import propen.impl.sipel.repository.MaintenanceDb;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class MaintenanceRestServiceImpl implements MaintenanceRestService{

    @Autowired
    MaintenanceDb maintenanceDb;

    @Override
    public List<MaintenanceModel> retrieveListMaintenance() {
        return maintenanceDb.findAll();
    }
}
